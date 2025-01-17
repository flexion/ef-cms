/* eslint-disable @miovision/disallow-date/no-new-date */
import {
  LogicalReplicationService,
  PgoutputPlugin,
} from 'pg-logical-replication';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';

interface Log {
  relation: Record<string, any>;
  tag: string;
  new: Record<string, any>;
}

interface TransformedData {
  table: string;
  operation: string;
  body: Record<string, any>;
  timestamp: Date;
}

export const processStreamPostgresLambda = async () => {
  const replicationService = new LogicalReplicationService({
    connectionString:
      process.env.PG_CONNECTION_STRING ||
      'postgresql://postgres:example@localhost:5432/postgres',
  });

  const opensearchClient = new OpenSearchClient({
    node: process.env.OPENSEARCH_URL || 'http://localhost:9200',
  });

  async function startReplication() {
    try {
      const plugin = new PgoutputPlugin({
        protoVersion: 2,
        publicationNames: [process.env.PUBLICATION_NAME || 'my_publication'],
      });

      replicationService.on('data', async (lsn, log: Log) => {
        console.log('Received log:', log);

        // Transform and send to OpenSearch
        if (log.tag === 'insert') {
          const transformedData = transformLog(log);
          await sendToOpenSearch(transformedData);
        }
      });

      console.log('Starting replication...');
      // LSN acknowledgment is handled automatically by the subscription
      await replicationService.subscribe(
        plugin,
        process.env.REPLICATION_SLOT || 'debezium_slot',
      );
    } catch (error) {
      console.error('Error during replication:', error);
    }
  }

  function transformLog(log: Log): TransformedData {
    return {
      body: log.new,
      operation: log.tag,
      table: log.relation.name,
      timestamp: new Date(),
    };
  }

  async function sendToOpenSearch(data: TransformedData) {
    try {
      await opensearchClient.index({
        body: {
          ...data.body,
          timestamp: data.timestamp.toISOString(),
        },
        index: data.table,
      });
      console.log('Data sent to OpenSearch:', data);
    } catch (error) {
      console.error('Error sending to OpenSearch:', error);
    }
  }

  await startReplication();
};
