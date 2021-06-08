const ElasticsearchScrollStream = require('elasticsearch-scroll-stream');
const { getClient } = require('../elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const findDocketEntries = async () => {
  const esClient = await getClient({ environmentName, version });

  let allDocketEntries = [];

  const esStream = new ElasticsearchScrollStream(
    esClient,
    {
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
      size: 500,
    },
    ['inner_hits'],
  );

  console.log('Stream created');

  esStream.on('data', async data => {
    const docketEntryDocument = JSON.parse(data.toString());
    const caseMapping =
      docketEntryDocument['inner_hits']['case-mappings'].hits.hits[0][
        '_source'
      ];

    allDocketEntries.push({
      ...docketEntryDocument,
      ...caseMapping,
      entityName: { S: 'DocketEntry' },
      isCaseSealed: {
        BOOL: !!caseMapping.isSealed?.BOOL,
      },
      sk: { S: `docket-entry|${docketEntryDocument.docketEntryId.S}` },
    });

    if (allDocketEntries.length === 500) {
      const body = allDocketEntries
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

      esClient.bulk({
        body,
        refresh: false,
      });

      console.log('Sent bulk of 500');

      allDocketEntries = [];
    }
  });

  esStream.on('end', () => {
    console.log('done');
  });
};
(async () => {
  await findDocketEntries();

  // output the case information
  // const results = docketEntries.filter(Boolean);
})();
