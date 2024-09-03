import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { search } from '../searchClient';

export const getUserInboxMessages = async ({ applicationContext, userId }) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'toUserId.S': userId },
            },
            {
              term: { 'isRepliedTo.BOOL': false },
            },
            {
              term: { 'isCompleted.BOOL': false },
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

  applicationContext.logger.info('getUserInboxMessages end');

  return results;
};