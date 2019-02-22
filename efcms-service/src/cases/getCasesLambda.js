const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for fetching all cases of a particular status, user role, etc
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.get = event =>
  handle(event, () => {
    const status = (event.queryStringParameters || {}).status;
    const documentId = (event.queryStringParameters || {}).documentId;
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const useCase = applicationContext.getInteractorForGettingCases({
      user,
      documentId,
      applicationContext,
    });
    return useCase({
      documentId,
      user,
      status: status,
      applicationContext,
    });
  });
