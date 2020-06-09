const { search } = require('./searchClient');

/**
 * getIndexedCasesForUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.statuses case status to filter by
 * @param {string} providers.userId the userId to filter cases by
 * @returns {object} the case data
 */
exports.getIndexedCasesForUser = async ({
  applicationContext,
  statuses,
  userId,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketNumber',
          'docketNumberWithSuffix',
          'caseCaption',
          'leadCaseId',
          'caseId',
          'createdAt',
          'status',
        ],
        query: {
          bool: {
            must: [
              {
                match: {
                  'pk.S': { operator: 'and', query: `user|${userId}` },
                },
              },
              {
                match: {
                  'sk.S': { operator: 'and', query: 'case|' },
                },
              },
              {
                match: {
                  'gsi1pk.S': { operator: 'and', query: 'user-case|' },
                },
              },
              {
                bool: {
                  should: statuses.map(status => ({
                    match: {
                      'status.S': { operator: 'and', query: status },
                    },
                  })),
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-user-case',
    },
  });

  return results;
};
