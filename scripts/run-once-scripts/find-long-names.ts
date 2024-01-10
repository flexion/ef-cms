// usage: npx ts-node --transpile-only scripts/run-once-scripts/find-long-names.ts

import { requireEnvVars } from '../../shared/admin-tools/util';
requireEnvVars(['ENV', 'REGION']);

import { createApplicationContext } from '../../web-api/src/applicationContext';
import { searchAll } from '../../web-api/src/persistence/elasticsearch/searchClient';

const getAllCases = async applicationContext => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            filter: { exists: { field: 'docketNumber.S' } },
          },
        },
      },
      index: 'efcms-case',
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  await getAllCases(applicationContext);
})();
