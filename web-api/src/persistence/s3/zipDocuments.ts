import { AsyncZipDeflate, Zip } from 'fflate';
import { PassThrough, Writable } from 'stream';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';
import { chunk } from 'lodash';
import { cpus } from 'os';
import { netstat } from 'node-os-utils';

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

Many S3 Clients. No parallelization:
Duration: 106897.34 ms	Billed Duration: 106898 ms	Memory Size: 7000 MB	Max Memory Used: 969 MB
Duration: 112162.03 ms	Billed Duration: 112163 ms	Memory Size: 7000 MB	Max Memory Used: 1072 MB
Duration: 110400.68 ms	Billed Duration: 110401 ms	Memory Size: 7000 MB	Max Memory Used: 1072 MB
Duration: 101778.89 ms	Billed Duration: 101779 ms	Memory Size: 7000 MB	Max Memory Used: 1126 MB
Duration: 90429.72 ms	  Billed Duration: 90430 ms	  Memory Size: 7000 MB	Max Memory Used: 1459 MB

Many S3 Clients. parallelization w/ 4 processes:
Duration: 73162.39 ms	Billed Duration: 73163 ms	Memory Size: 7000 MB	Max Memory Used: 2530 MB
Duration: 73040.62 ms	Billed Duration: 73041 ms	Memory Size: 7000 MB	Max Memory Used: 2530 MB
Duration: 72233.40 ms	Billed Duration: 72234 ms	Memory Size: 7000 MB	Max Memory Used: 2755 MB
Duration: 74471.14 ms	Billed Duration: 74472 ms	Memory Size: 7000 MB	Max Memory Used: 2874 MB
Duration: 74391.22 ms	Billed Duration: 74392 ms	Memory Size: 7000 MB	Max Memory Used: 2927 MB

Many S3 Clients. parallelization w/ 8 processes:
Duration: 84925.62 ms	Billed Duration: 84926 ms	Memory Size: 7000 MB	Max Memory Used: 2554 MB
Duration: 80978.39 ms	Billed Duration: 80979 ms	Memory Size: 7000 MB	Max Memory Used: 2823 MB
Duration: 78094.34 ms	Billed Duration: 78095 ms	Memory Size: 7000 MB	Max Memory Used: 2902 MB
Duration: 70474.41 ms	Billed Duration: 70475 ms	Memory Size: 7000 MB	Max Memory Used: 3025 MB
Duration: 72388.79 ms	Billed Duration: 72389 ms	Memory Size: 7000 MB	Max Memory Used: 3143 MB

Duration: 167998.84 ms	Billed Duration: 167999 ms	Memory Size: 7000 MB	Max Memory Used: 2689 MB	Init Duration: 2050.39 ms
*/

/**
 * WE LEFT OFF: We can measure upload speed by bypassing all of the zipping/downloading and just uploading a large file from a lambda directly.
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
  console.log('cpu: ', cpus());
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 100 });
  const info = await netstat.inOut();
  console.log('Network Info', info);

  const upload = new Upload({
    client: applicationContext.getStorageClient(),
    params: {
      Body: passThrough,
      Bucket: applicationContext.environment.tempDocumentsBucketName,
      Key: outputZipName,
    },
  });

  const writable = new Writable({
    write(_chunk, encoding, callback) {
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

  const documentChunks = chunk(documents, 4);
  for (let index = 0; index < documentChunks.length; index++) {
    const documentChunk = documentChunks[index];
    await Promise.all(
      documentChunk.map(async document => {
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
      }),
    );
  }

  zip.end();
  await uploadPromise;
}
