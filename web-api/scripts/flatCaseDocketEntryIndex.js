const ElasticsearchScrollStream = require('elasticsearch-scroll-stream');
const { getClient } = require('../elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const SLICE_START_ID = 98;
const sliceIds = new Array(SLICE_START_ID)
  .fill('')
  .map((v, i) => SLICE_START_ID - i);

const QUERY_SIZE = 5000;
const BULK_SIZE = 200;
let inserted = 0;

const findDocketEntries = async sliceId => {
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
        slice: {
          id: sliceId,
          max: 100,
        },
      },
      index: 'efcms-docket-entry',
      scroll: '2m',
      size: QUERY_SIZE,
    },
    ['inner_hits'],
  );

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

    if (allDocketEntries.length === BULK_SIZE) {
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

      esClient
        .bulk({
          body,
          refresh: false,
        })
        .then(response => {
          if (response.errors) {
            console.log('error when bulk inserting');
            // response.items.forEach((action, i) => {
            //   const operation = Object.keys(action)[0];
            //   if (action[operation].error) {
            //     let record = body[i * 2 + 1];
            //     failedRecords.push(record);
            //   }
            // });
          }
        });

      inserted += BULK_SIZE;
      console.log('sliceId', sliceId, ' - ', inserted, 'inserted');

      allDocketEntries = [];
    }
  });

  return new Promise(resolve => {
    esStream.on('end', () => {
      console.log('done');
      resolve();
    });
  });
};

(async () => {
  for (const sliceId of sliceIds) {
    await findDocketEntries(sliceId);
  }

  // output the case information
  // const results = docketEntries.filter(Boolean);
})();
