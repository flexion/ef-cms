//@ts-nocheck
import { Agent } from 'https';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { writeFile } from 'fs/promises';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

//TODO: Meaningful logs for debugging

type DocketEntryDownloadInfo = {
  key: string;
  filePathInZip: string;
  useTempBucket: boolean;
};

type DocketEntriesZipperParameter = {
  oppositeS3Client: S3;
  s3Client: S3;
  docketEntries: DocketEntryDownloadInfo[];
  zipName: string;
  connectionId: string;
  wsClient: ApiGatewayManagementApiClient;
};

const {
  AWS_REGION,
  DOCKET_ENTRY_FILES,
  EFCMS_DOMAIN,
  STAGE,
  WEBSOCKET_API_GATEWAY_ID,
  WEBSOCKET_CONNECTION_ID,
  WEBSOCKET_REGION,
  ZIP_FILE_NAME,
} = process.env;

const SELECTED_REGION = AWS_REGION! as 'us-east-1' | 'us-west-1';
const OPPOSITE_REGION_DICT = {
  'us-east-1': 'us-west-1',
  'us-west-1': 'us-east-1',
};

const DOCKET_ENTRIES: DocketEntryDownloadInfo[] = JSON.parse(
  DOCKET_ENTRY_FILES!,
);

const storageClient = new S3({
  endpoint: `https://s3.${SELECTED_REGION}.amazonaws.com`,
  forcePathStyle: true,
  maxAttempts: 3,
  region: SELECTED_REGION,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 30000,
  }),
});

const oppositeRegionStorageClient = new S3({
  endpoint: `https://s3.${OPPOSITE_REGION_DICT[SELECTED_REGION]}.amazonaws.com`,
  forcePathStyle: true,
  maxAttempts: 3,
  region: OPPOSITE_REGION_DICT[SELECTED_REGION],
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 30000,
  }),
});

const TEMP_S3_BUCKET = `${EFCMS_DOMAIN}-temp-documents-${STAGE}-${SELECTED_REGION}`;
const S3_BUCKET = `${EFCMS_DOMAIN}-documents-${STAGE}-${SELECTED_REGION}`;

const WEBSOCKET_ENPOINT = `https://${WEBSOCKET_API_GATEWAY_ID}.execute-api.${WEBSOCKET_REGION}.amazonaws.com/${STAGE}`;
const notificationClient = new ApiGatewayManagementApiClient({
  endpoint: WEBSOCKET_ENPOINT,
  region: WEBSOCKET_REGION,
  requestHandler: new NodeHttpHandler({
    requestTimeout: 900000,
  }),
});

function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function getS3ClientBasedOnObjectExistence(
  key: string,
  bucketName: string,
  client1: S3,
  client2: S3,
): Promise<S3> {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await client1
    .send(command)
    .then(() => client1)
    .catch(() => client2);
}

async function downloadFile(
  docketEntry: DocketEntryDownloadInfo,
  s3Client: S3,
  oppositeS3Client: S3,
  DIRECTORY: string,
) {
  const { filePathInZip, key, useTempBucket } = docketEntry;
  const BUCKET_NAME = useTempBucket ? TEMP_S3_BUCKET : S3_BUCKET;
  const client = await getS3ClientBasedOnObjectExistence(
    key,
    BUCKET_NAME,
    s3Client,
    oppositeS3Client,
  );
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const data = await client.send(command);
  if (!data.Body) throw new Error(`Unable to get document (${key})`);

  const bodyContents: any = await streamToBuffer(data.Body);
  const FILE_PATH = path.join(DIRECTORY, `${filePathInZip}`);
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, bodyContents);
}

function zipFolder(
  sourceFolderPath: string,
  outZipPath: string,
): Promise<void> {
  const output = fs.createWriteStream(outZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));
    archive.pipe(output);
    archive.directory(sourceFolderPath, false);
    void archive.finalize();
  });
}

async function uploadZipFile(s3Client: S3, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  const uploadParams = {
    Body: fileStream,
    Bucket: TEMP_S3_BUCKET,
    ContentType: 'application/zip',
    Key: fileName,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
}

export async function app({
  connectionId,
  docketEntries,
  oppositeS3Client,
  s3Client,
  wsClient,
  zipName,
}: DocketEntriesZipperParameter) {
  const DIRECTORY = path.join(__dirname, `${Date.now()}/`);
  if (!fs.existsSync(DIRECTORY)) fs.mkdirSync(DIRECTORY);

  let counter = 0;
  const BATCH_SIZE = 10;
  console.log('STARTING TO DOWNLOAD THE FILES');
  for (let i = 0; i < docketEntries.length; i += BATCH_SIZE) {
    const batch = docketEntries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async docketEntry => {
        await downloadFile(docketEntry, s3Client, oppositeS3Client, DIRECTORY);
        counter += 1;
        const WS_MESSAGE = new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({
            action: 'batch_download_progress',
            filesCompleted: counter,
            totalFiles: docketEntries.length,
          }),
        });

        await wsClient.send(WS_MESSAGE).catch(console.error);
      }),
    );
  }
  console.log('DOWNLOADED ALL THE FILES');

  console.log('GOING TO ZIP THE FOLDER');
  const ZIP_PATH = path.join(__dirname, zipName);
  await zipFolder(DIRECTORY, ZIP_PATH);
  console.log('UPLOADING THE ZIP FILE TO S3');
  await uploadZipFile(s3Client, ZIP_PATH);
  console.log('FETCHING THE DOWNLOAD LINK FOR THE ZIP FILE IN S3');

  const command = new GetObjectCommand({
    Bucket: TEMP_S3_BUCKET,
    Key: zipName,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });
  const WS_MESSAGE = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: JSON.stringify({
      action: 'batch_download_ready',
      url,
    }),
  });

  console.log('SENDING LINK TO USER');
  await wsClient.send(WS_MESSAGE).catch(console.error);
  console.log('COMPLETE');
}

app({
  connectionId: WEBSOCKET_CONNECTION_ID!,
  docketEntries: DOCKET_ENTRIES,
  oppositeS3Client: oppositeRegionStorageClient,
  s3Client: storageClient,
  wsClient: notificationClient,
  zipName: ZIP_FILE_NAME!,
}).catch(console.error);