#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { environment } from '@web-api/environment';
import { indexOpenSearchCase } from 'web-api/elasticsearch/index-cases';

const scriptConfig: ScriptConfig = {
  description: 'add-cases-to-opensearch - Reupsert cases',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const casePageSize = 10000;

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getCasesToUpsert = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(['docketNumber'])
      .orderBy('docketNumber')
      .limit(casePageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItems = 0;

async function main() {
  let offset = 0;
  const casesToUpsert = await getCasesToUpsert(offset);

  while (!isEmpty(casesToUpsert)) {
    const message = {
      payload: casesToUpsert.map(d => d.docketNumber),
      type: 'dwCase',
      timestamp: Date.now(),
    };
    await indexOpenSearchCase({ message });
    totalItems += casesToUpsert.length;
    console.log(`Total cases upserted so far: ${totalItems}`);
    offset += casePageSize;
  }
  console.log('Done upserting cases');
}

main().catch(console.error);
