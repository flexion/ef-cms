import { genericHandler } from '../genericHandler';

/**
 * used for fetching full user data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserByIdLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getUserByIdInteractor(applicationContext, {
        userId: event.pathParameters.userId,
      });
  });
