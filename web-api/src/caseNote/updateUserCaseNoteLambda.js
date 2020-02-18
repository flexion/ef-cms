const { genericHandler } = require('../genericHandler');

/**
 * used for updating a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { caseId } = event.pathParameters || {};
    const { notes } = JSON.parse(event.body);

    return await applicationContext.getUseCases().updateUserCaseNoteInteractor({
      applicationContext,
      caseId,
      notes,
    });
  });
