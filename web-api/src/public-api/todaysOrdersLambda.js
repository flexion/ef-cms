const { genericHandler } = require('../genericHandler');

/**
 * used for fetching orders served on the current date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.todaysOrdersLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getTodaysOrdersInteractor(applicationContext, {
          ...event.pathParameters,
        });
    },
    { user: {} },
  );
