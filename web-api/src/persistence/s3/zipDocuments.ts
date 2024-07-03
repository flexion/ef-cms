import { AsyncZipDeflate, Zip } from 'fflate';
import { PassThrough, Writable } from 'stream';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';

/**
 *
Timings: (also see screenshots on Rachel's desktop)
No parallelization:
102411.38ms
1243 MB

Parallelized:
181871ms
2474 MB

76769 ms
2173 MB
*/

/**
 * WE LEFT OFF: Brice asked the question: "Do we know we have seperate connections for upload/download?". We should explore if using multiple S3 clients for reading documents or at least upload zip/download documents improves things.
 */

export type ProgressData = {
  totalFiles: number;
  filesCompleted: number;
};

export async function zipDocuments(
  applicationContext: ServerApplicationContext,
  {
    documents,
    onProgress,
    outputZipName,
  }: {
    onProgress?: (params: ProgressData) => Promise<void> | void;
    documents: {
      key: string;
      filePathInZip: string;
      useTempBucket: boolean;
    }[];
    outputZipName: string;
  },
): Promise<void> {
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 100 });

  const upload = new Upload({
    client: applicationContext.getStorageClient(),
    params: {
      Body: passThrough,
      Bucket: applicationContext.environment.tempDocumentsBucketName,
      Key: outputZipName,
    },
  });

  const writable = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });

  passThrough.pipe(writable);

  // Start the upload process
  const uploadPromise = upload.done();

  const zip = new Zip((err, data, final) => {
    if (err) {
      console.log('Error creating zip stream');
      throw err;
    }

    passThrough.write(data);

    if (final) {
      passThrough.end();
    }
  });

  for (let index = 0; index < documents.length; index++) {
    const document = documents[index];

    const response = await applicationContext.getStorageClient().getObject({
      Bucket: document.useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: document.key,
    });
    if (!response.Body) {
      throw new Error(
        `Unable to get document (${document.key}) from persistence.`,
      );
    }

    // Transform s3 getobject into a stream of data that can be piped into the zip processor
    const bodyStream: ReadableStream<Uint8Array> =
      response.Body.transformToWebStream();
    const reader = bodyStream.getReader();
    const compressedPdfStream = new AsyncZipDeflate(document.filePathInZip);
    zip.add(compressedPdfStream);

    let continueReading = true;
    const start = Date.now();
    while (continueReading) {
      const unzippedChunk = await reader.read();
      const nextChunk = unzippedChunk.value || new Uint8Array();
      continueReading = !unzippedChunk.done;
      compressedPdfStream.push(nextChunk, unzippedChunk.done);
      while (passThrough.readableLength > 1024 * 1024 * 10) {
        // Wait for the buffer to be drained, before downloading more files
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    const end = Date.now();
    console.log(
      `Done reading document ${document.key}, time elapsed: `,
      start - end,
    );
    reader.releaseLock();

    if (onProgress) {
      await onProgress({
        filesCompleted: index + 1,
        totalFiles: documents.length,
      });
    }
  }

  zip.end();
  await uploadPromise;
}
