const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const applicationContext = createApplicationContext({});
    try {
      const results = await applicationContext
        .getUseCases()
        .getPublicCaseInteractor({
          applicationContext,
          caseId: event.pathParameters.caseId,
        });
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      // we don't want email alerts to be sent out just because someone searched for a non-existing case
      if (!e.message.includes('was not found.')) {
        applicationContext.logger.error(e);
      }
      throw e;
    }
  });
