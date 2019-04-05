const createApplicationContext = require('../applicationContext');
const {
  handle,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');

/**
 * updates a work item
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().forwardWorkItem({
      ...JSON.parse(event.body),
      workItemId: event.pathParameters.workItemId,
      workItemToUpdate: JSON.parse(event.body),
      applicationContext,
    });
  });
