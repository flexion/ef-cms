const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * run the trial session planning report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .runTrialSessionPlanningReportInteractor({
          applicationContext,
          ...JSON.parse(event.body),
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
