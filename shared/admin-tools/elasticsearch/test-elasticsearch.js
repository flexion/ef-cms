const AWS = require('aws-sdk');
const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../src/business/entities/EntityConstants');
const { get } = require('lodash');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });

  const searchString = /^\s/;

  const documentQuery = {
    body: {
      _source: ['docketNumber'],
      from: 0,
      query: {
        bool: {
          must: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              bool: {
                must: [
                  {
                    terms: {
                      'eventCode.S': [
                        ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
                        ...ORDER_EVENT_CODES,
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      size: 20000,
    },
    index: 'efcms-docket-entry',
  };

  let results = await esClient.search(documentQuery);

  const hits = get(results, 'hits.hits');
  const total = get(results, 'hits.total.value');
  const formatHit = hit => {
    return {
      ...AWS.DynamoDB.Converter.unmarshall(hit['_source']),
      score: hit['_score'],
    };
  };

  if (hits && hits.length > 0) {
    results = hits.map(formatHit);
  }
  console.log('total results', total);
  console.log(JSON.stringify(results.length));
})();

/*

* Exact matches = exact words in the exact order
         OR = exact word in any order

* If there are no exact matches, inform the user
* If there are no exact matches, user can perform a partial match search
* Partial match = any words in any order

*/
