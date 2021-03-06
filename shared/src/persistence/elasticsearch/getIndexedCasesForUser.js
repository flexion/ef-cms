const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
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
  const searchParameters = {
    body: {
      _source: [
        'caseCaption',
        'createdAt',
        'docketNumber',
        'docketNumberWithSuffix',
        'leadDocketNumber',
        'status',
        'closedDate',
      ],
      query: {
        bool: {
          must: [
            {
              term: {
                'pk.S': `user|${userId}`,
              },
            },
            {
              terms: {
                'status.S': statuses,
              },
            },
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-user-case',
  };

  if (statuses.length === 1 && statuses[0] === CASE_STATUS_TYPES.closed) {
    searchParameters.body.sort = [{ 'closedDate.S': { order: 'desc' } }];
  }

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  return results;
};
