const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * associate
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.associate = event =>
  handle(() =>
    applicationContext.getUseCases().associateRespondentToCase({
      userId: getAuthHeader(event),
      caseId: JSON.parse(event.body).caseId,
      applicationContext,
    }),
  );
