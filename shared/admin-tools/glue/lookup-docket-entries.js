/**
 * This script is to help search for users belonging to a certain role in the
 * environment designated by the ENV environment variable
 *
 * You must have the following Environment variables set:
 * - ENV: The name of the environment you are working with (mig)
 *
 * Example usage:
 *
 * $ npm run admin:lookup-user docketClerk "Beth"
 */

const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../src/business/entities/EntityConstants');
const { checkEnvVar } = require('../util');
const { getClient } = require('../../../web-api/elasticsearch/client');
const { truncate } = require('lodash');

const { ENV } = process.env;

checkEnvVar(ENV, 'You must have ENV set in your environment');

if (process.argv.length < 2) {
  console.log(`Lookup User IDs and roles for the specified environment.
  
  Usage:

  $ npm run admin:lookup-user -- <ROLE> [<NAME>]
  
  - ROLE: The role to find
  - NAME: The name of the user you're looking for (optional)

  Example:

  $ npm run admin:lookup-user -- admissionsClerk "Joe Burns"

`);
  process.exit();
}

const role = process.argv[2];
const userName = process.argv[3];

const lookupUsers = async () => {
  const esClient = await getClient({ environmentName: ENV });
  const query = userName
    ? {
        bool: {
          must: [
            { match: { 'role.S': role } },
            { match: { 'name.S': userName } },
          ],
        },
      }
    : {
        // match: { 'role.S': role },
        bool: {
          must: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              bool: {
                must_not: {
                  exists: {
                    field: 'numberOfPages',
                  },
                },
              },
            },
            {
              simple_query_string: {
                default_operator: 'and',
                fields: ['documentContents.S', 'documentTitle.S'],
                query: 'Transfer',
              },
            },
            {
              terms: {
                'eventCode.S': [
                  ...ORDER_EVENT_CODES,
                  ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
                ],
              },
            },
          ],
        },
      };

  try {
    const results = await esClient.search({
      body: {
        _source: [
          'docketEntryId',
          'eventCode',
          'numberOfPages',
          'servedAt',
          'isFileAttached',
          'documentTitle',
          'docketNumber',
        ],
        query,
      },
      index: 'efcms-docket-entry',
      size: 2000,
    });
    return results.hits.hits.map(hit => {
      return {
        DocketEntryId: hit['_source']['docketEntryId']?.S,
        DocketNumber: hit['_source']['docketNumber']?.S,
        EventCode: hit['_source']['eventCode']?.S,
        // IsFileAttached: hit['_source']['isFileAttached']?.S,
        NumberOfPages: hit['_source']['numberOfPages']?.S,
        ServedAt: hit['_source']['servedAt']?.S,
        Title: truncate(hit['_source']['documentTitle']?.S),
      };
    });
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  const users = await lookupUsers();
  console.table(users);
})();
