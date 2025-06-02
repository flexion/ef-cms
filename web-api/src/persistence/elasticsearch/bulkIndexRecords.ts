import { chunk } from 'lodash';
import { getIndexNameForRecord } from './getIndexNameForRecord';
import type { IDynamoDBRecord } from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const bulkIndexRecords = async ({
  applicationContext,
  records,
}: {
  applicationContext: ServerApplicationContext;
  records: IDynamoDBRecord[];
}) => {
  const searchClient = applicationContext.getSearchClient();

  const CHUNK_SIZE = 100;
  const chunkOfRecords = chunk(records, CHUNK_SIZE);

  const failedRecords = [];

  await Promise.all(
    chunkOfRecords.map(async recordChunk => {
      const body = recordChunk
        .map(record => ({
          ...record.dynamodb?.NewImage,
        }))
        .flatMap(doc => {
          const index = getIndexNameForRecord(doc);
          let id = `${doc.pk.S}_${doc.sk.S}`;
          let routing = '';

          if (index) {
            if (doc.entityName.S === 'DocketEntry') {
              routing = `${doc.pk.S}_${doc.pk.S}|mapping`;
            }
            if (doc.entityName.S === 'WorkItem') {
              routing = `${doc.pk.S}_${doc.pk.S}|mapping`;
            }
            if (doc.entityName.S === 'CaseDocketEntryMapping') {
              id += '|mapping';
            }
            if (doc.entityName.S === 'CaseMessageMapping') {
              id += '|mapping';
            }
            if (doc.entityName.S === 'CaseWorkItemMapping') {
              id += '|mapping';
            }

            return [
              {
                index: {
                  _id: id,
                  _index: index,
                  routing,
                },
              },
              doc,
            ];
          }
        })
        .filter(item => item);

      if (body.length) {
        const response = await searchClient.bulk({
          body,
          refresh: false,
        });
        if (response.body.errors || response.statusCode != 200) {
          console.error('Failed request: ', response.meta.request);
          throw new Error('Error indexing records');
        }
      }
    }),
  );

  return { failedRecords };
};
