const { calculateISODate } = require('../../../business/utilities/DateHandler');
const { GET_PARENT_CASE } = require('../helpers/searchClauses');
const { search } = require('../searchClient');

exports.getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'completedBySection.S': section },
            },
            {
              term: { 'isCompleted.BOOL': true },
            },
            {
              range: {
                'completedAt.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: filterDate,
                },
              },
            },
            GET_PARENT_CASE,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-message',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
