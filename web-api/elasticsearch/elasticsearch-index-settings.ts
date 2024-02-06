import { Client } from '@opensearch-project/opensearch';
import { getClient } from './client';
import { setupIndexes } from './elasticsearch-index-settings.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const environmentName: string = process.env.ENV || 'local';
  const elasticsearchEndpoint: string = process.argv[2];

  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await setupIndexes({ client, environmentName });
})();
