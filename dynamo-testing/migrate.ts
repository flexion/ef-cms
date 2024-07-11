// time node --loader ts-node/esm -r ts-node/register --max-old-space-size=16000 ./other/migrate.ts

import { client } from './util/client';
import { generateUuidPairs } from './util/generatePrefix';
import { queryByPrefixList } from './util/queryByPrefixList';

const TABLE_NAME = 'cody-test-table';
const INDEX_NAME = 'entityName-sk-index';

async function main() {
  const prefixes = generateUuidPairs('1234567890').map(pair => `case|${pair}`);

  const entries = await queryByPrefixList(
    client,
    TABLE_NAME,
    INDEX_NAME,
    prefixes,
  );

  console.log('going to update: ', entries.length);

  // await batchWriteAll(client, TABLE_NAME, entries);

  console.log('done');
}

main().catch(console.error);
