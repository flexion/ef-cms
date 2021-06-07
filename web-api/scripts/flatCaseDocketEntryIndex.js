const AWS = require('aws-sdk');
const {
  bulkIndexRecords,
} = require('../../shared/src/persistence/elasticsearch/bulkIndexRecords');
const { chunk } = require('lodash');
const { getClient } = require('../elasticsearch/client');

const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../shared/src/business/entities/EntityConstants');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const findDocketEntries = async () => {
  const esClient = await getClient({ environmentName, version });

  const allDocketEntries = [];
  const responseQueue = [];

  // start things off by searching, setting a scroll timeout, and pushing
  // our first response into the queue to be processed
  const response = await esClient.search({
    body: {
      _source: ['*', 'parent.*', 'case-mappings.*'],
      query: {
        bool: {
          filter: [{ term: { 'entityName.S': 'DocketEntry' } }],
          must: [
            {
              has_parent: {
                inner_hits: {
                  _source: ['*'],
                  name: 'case-mappings',
                },
                parent_type: 'case',
                query: { match_all: {} },
                score: true,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    scroll: '30s',
    size: 1000,
  });

  console.log('Got a response.');

  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allDocketEntries.push({
        ...hit['_source'],
        ...hit['inner_hits']['case-mappings'].hits.hits[0]['_source'],
        entityName: { S: 'DocketEntry' },
        isCaseSealed: {
          BOOL: !!hit['inner_hits']['case-mappings'].hits.hits[0]['_source']
            .isSealed?.BOOL,
        },
        sk: { S: `docket-entry|${hit['_source'].docketEntryId.S}` },
      });
    });

    // check to see if we have collected all of the quotes
    if (true || body.hits.total.value === allDocketEntries.length) {
      return allDocketEntries;
    }

    // // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '30s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};
(async () => {
  const docketEntries = await findDocketEntries();

  // output the case information
  const results = docketEntries.filter(Boolean);

  const esClient = await getClient({ environmentName, version });

  const failedRecords = [];

  const chunks = chunk(results, 50);
  let done = 0;
  for (let chunkOfRecords of chunks) {
    const body = chunkOfRecords
      .flatMap(doc => {
        const index = 'efcms-docket-entry-no-parent';
        let id = `${doc.pk.S}_${doc.sk.S}`;

        return [
          {
            index: {
              _id: id,
              _index: index,
            },
          },
          doc,
        ];
      })
      .filter(item => item);

    if (body.length) {
      const response = await esClient.bulk({
        body,
        refresh: false,
      });

      console.log('Sent a bulk: ', ++done, chunks.length);

      if (response.errors) {
        response.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            let record = body[i * 2 + 1];
            failedRecords.push(record);
          }
        });
      }
    }
  }

  console.log('failedRecords', failedRecords);
})();
