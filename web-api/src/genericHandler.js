const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * generic handler function for use in lambdas
 *
 * @param {object} event the AWS event object
 * @param {Function} cb the code to be executed
 * @param options
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.genericHandler = (event, cb, options = {}) => {
  handle(event, async () => {
    const user = options.user || getUserFromAuthHeader(event);
    const logResultsLabel = options.logResultsLabel || 'Results';
    const logUserLabel = options.logUserLabel || 'User';

    const applicationContext = createApplicationContext(user);

    try {
      const results = await cb({ applicationContext, user });
      applicationContext.logger.info(logUserLabel, user);
      applicationContext.logger.info(logResultsLabel, results);
      return results;
    } catch (e) {
      if (!e.skipLogging) {
        // we don't want email alerts to be sent out just because someone searched for a non-existing case
        applicationContext.logger.error(e);
      }
      throw e;
    }
  });
};
