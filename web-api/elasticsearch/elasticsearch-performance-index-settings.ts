import { Client } from '@opensearch-project/opensearch';
import { getClient } from './client';
import { setupPerformanceIndexes } from './elasticsearch-index-settings.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const environmentName: string = process.env.ENV || 'local';
  const elasticsearchPerformanceEndpoint: string = process.argv[2];

  const client: Client = await getClient({
    elasticsearchEndpoint: elasticsearchPerformanceEndpoint,
    environmentName,
  });

  await setupPerformanceIndexes({ client, environmentName });
})();
