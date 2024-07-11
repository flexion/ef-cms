import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { batchWriteEntries } from './batchWrite';
import { chunk } from 'lodash';

const WRITE_CONCURRENCY = 150;
const MAX_CHUNK_SIZE = 25; // dynamo limit

class Semaphore {
  private available: number;
  private queue: Array<() => void>;

  constructor(count: number) {
    this.available = count;
    this.queue = [];
  }

  acquire() {
    return new Promise<void>(resolve => {
      if (this.available > 0) {
        this.available--;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release() {
    this.available++;
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      if (resolve) {
        this.available--;
        resolve();
      }
    }
  }
}

export async function batchWriteAll(
  client: DynamoDBClient,
  tableName: string,
  entries: any[],
) {
  const batches = chunk(entries, MAX_CHUNK_SIZE).map(records => {
    return () => {
      return batchWriteEntries(client, tableName, records);
    };
  });

  const semaphore = new Semaphore(WRITE_CONCURRENCY);
  let remaining = batches.length;

  console.log('batches to write', batches.length);

  await Promise.all(
    batches.map(async batch => {
      await semaphore.acquire();
      await batch();
      semaphore.release();
      console.log('remaining', remaining--);
    }),
  );
}
