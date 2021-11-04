const { genericHandler } = require('../genericHandler');

/**
 * gets the internal opinion search enabled flag
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getInternalOpinionSearchEnabledLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInternalOpinionSearchEnabledInteractor(applicationContext);
  });
