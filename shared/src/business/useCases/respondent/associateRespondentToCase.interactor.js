const {
  isAuthorized,
  FILE_ANSWER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.associateRespondentToCase = async ({
  userId,
  caseId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_ANSWER)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  const user = await applicationContext.getUseCases().getUser(userId);

  await applicationContext.getPersistenceGateway().createRespondentCaseMapping({
    respondentBarNumber: user.barNumber,
    caseId,
    applicationContext,
  });

  return {
    createdAt: new Date().toISOString(),
  };
};
