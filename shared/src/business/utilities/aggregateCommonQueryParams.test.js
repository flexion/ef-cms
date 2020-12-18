const {
  CASE_SEARCH_MIN_YEAR,
  COUNTRY_TYPES,
  US_STATES,
} = require('../entities/EntityConstants');
const { aggregateCommonQueryParams } = require('./aggregateCommonQueryParams');
const { applicationContext } = require('../test/createTestApplicationContext');
const { formatNow } = require('./DateHandler');

describe('aggregateCommonQueryParams', () => {
  it('should return an object containing aggregated query param arrays', () => {
    const result = aggregateCommonQueryParams({}, {});

    expect(result).toMatchObject({
      commonQuery: [{ match: { 'entityName.S': 'Case' } }],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerName if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerName: 'Test Search',
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [{ match: { 'entityName.S': 'Case' } }],
      exactMatchesQuery: [
        {
          bool: {
            must: [
              {
                simple_query_string: {
                  default_operator: 'and',
                  fields: [
                    'contactPrimary.M.name.S',
                    'contactPrimary.M.secondaryName.S',
                    'contactSecondary.M.name.S',
                  ],
                  flags: 'AND|PHRASE|PREFIX',
                  query: 'Test Search',
                },
              },
            ],
          },
        },
      ],
      nonExactMatchesQuery: [
        {
          query_string: {
            fields: [
              'contactPrimary.M.name.S',
              'contactPrimary.M.secondaryName.S',
              'contactSecondary.M.name.S',
              'caseCaption.S',
            ],
            query: '*Test Search*',
          },
        },
      ],
    });
  });

  it('should include search params for countryType if present in query', () => {
    const queryParams = {
      applicationContext,
      countryType: COUNTRY_TYPES.DOMESTIC,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'contactPrimary.M.countryType.S': COUNTRY_TYPES.DOMESTIC,
                },
              },
              {
                match: {
                  'contactSecondary.M.countryType.S': COUNTRY_TYPES.DOMESTIC,
                },
              },
            ],
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for petitionerState if present in query', () => {
    const queryParams = {
      applicationContext,
      petitionerState: US_STATES.AR,
    };

    const result = aggregateCommonQueryParams(queryParams);

    expect(result).toMatchObject({
      commonQuery: [
        {
          bool: {
            should: [
              {
                match: {
                  'contactPrimary.M.state.S': US_STATES.AR,
                },
              },
              {
                match: {
                  'contactSecondary.M.state.S': US_STATES.AR,
                },
              },
            ],
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMin and yearFiledMax if present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMax: '2017',
      yearFiledMin: '2016',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: '2016||/y',
              lte: '2017||/y',
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMin if present in query and default yearFiledMax if not present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMin: '2018',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: '2018||/y',
              lte: `${formatNow('YYYY')}||/y`,
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });

  it('should include search params for yearFiledMax if present in query and default yearFiledMin if not present in query', () => {
    const queryParams = {
      applicationContext,
      yearFiledMax: '2019',
    };

    const result = aggregateCommonQueryParams(queryParams);
    expect(result).toMatchObject({
      commonQuery: [
        {
          range: {
            'receivedAt.S': {
              format: 'yyyy',
              gte: `${CASE_SEARCH_MIN_YEAR}||/y`,
              lte: '2019||/y',
            },
          },
        },
        { match: { 'entityName.S': 'Case' } },
      ],
      exactMatchesQuery: [],
      nonExactMatchesQuery: [],
    });
  });
});
