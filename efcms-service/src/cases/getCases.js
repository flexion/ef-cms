const { createDone, getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');

/**
 * GET Cases API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = (event, context, callback) => {
  const done = createDone(callback);

  let userToken;

  try {
    userToken = getAuthHeader(event);
  } catch (error) {
    done(error);
    return;
  }

  caseMiddleware
    .getCases(userToken)
    .then(caseRecords => {
      done(null, caseRecords);
    })
    .catch(done);
};
