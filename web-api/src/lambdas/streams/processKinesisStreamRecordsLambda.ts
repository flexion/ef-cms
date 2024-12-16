import { getLogger } from '@web-api/utilities/logger/getLogger';
import type { KinesisStreamEvent, KinesisStreamRecord } from 'aws-lambda';

export const processKinesisStreamRecordsLambda = async (
  event: KinesisStreamEvent,
) => {
  const recordsToProcess: KinesisStreamRecord[] = event.Records;
  getLogger().info('Streaming records from kinesis test', {
    stream: { recordsToProcess },
  });
};
