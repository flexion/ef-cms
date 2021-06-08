const { chunk } = require('lodash');
const { getClient } = require('../elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const findDocketEntries = async () => {
  const esClient = await getClient({ environmentName, version });

  let allDocketEntries = [];
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
    size: 4000,
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

    const failedRecords = [];

    const chunks = chunk(allDocketEntries, 1000);
    let done = 0;
    let promises = [];
    for (let chunkOfRecords of chunks) {
      const indexBody = chunkOfRecords
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

      if (indexBody.length) {
        promises.push(
          esClient.bulk({
            body: indexBody,
            refresh: false,
          }),
        );

        console.log('Sent a bulk: ', ++done, chunks.length);

        allDocketEntries = [];

        // if (resp.errors) {
        //   resp.items.forEach((action, i) => {
        //     const operation = Object.keys(action)[0];
        //     if (action[operation].error) {
        //       let record = body[i * 2 + 1];
        //       failedRecords.push(record);
        //     }
        //   });
        // }
      }
    }

    await Promise.all(promises);

    console.log('failedRecords', failedRecords);

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '30s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};
(async () => {
  await findDocketEntries();

  // output the case information
  // const results = docketEntries.filter(Boolean);
})();
