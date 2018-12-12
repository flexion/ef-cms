const {
  isAuthorized,
  FILE_ANSWER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const Case = require('../../entities/Case');

exports.associateRespondentToCase = async ({
  userId,
  caseId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_ANSWER)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  const caseToAssociate = await applicationContext.getUseCases().getCase({
    caseId,
    userId,
    applicationContext,
  });
  new Case(caseToAssociate).validate();

  const user = await applicationContext.getUseCases().getUser(userId);

  const rawCaseWithRespondent = new Case({
    ...caseToAssociate,
    respondent: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      title: user.title,
      email: user.email,
      address: user.address,
      isIRSAttorney: user.isIRSAttorney,
      phone: user.phone,
      barNumber: user.barNumber,
    },
  })
    .validate()
    .toJSON();

  await applicationContext.getUseCases().updateCase({
    caseId: rawCaseWithRespondent.caseId,
    caseJson: rawCaseWithRespondent,
    userId,
    applicationContext,
  });

  await applicationContext.getPersistenceGateway().createRespondentCaseMapping({
    respondentId: user.barNumber,
    caseId,
    applicationContext,
  });

  return {
    createdAt: new Date().toISOString(),
  };
};
