const { search } = require('../searchClient');

exports.getUserInboxMessages = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: {
            match: {
              'toUserId.S': { operator: 'and', query: userId },
            },
          },
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

  console.log('userId here is', userId);

  console.log('results', results);

  return results;
};
