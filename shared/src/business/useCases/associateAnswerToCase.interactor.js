const Case = require('../entities/Case');

exports.associateAnswerToCase = async ({
  answer,
  userId,
  caseId,
  applicationContext,
}) => {
  const user = await applicationContext.getUseCases().getUser(userId);

  const answerDocumentMetadata = {
    ...answer,
    filedBy: `${user.firstName} ${user.lastName}`,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  const caseToAssociate = await applicationContext.getUseCases().getCase({
    caseId,
    userId,
    applicationContext,
  });

  const caseWithAnswerAndRespondent = new Case({
    ...caseToAssociate,
    respondent: {
      respondentId: user.userId,
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
    documents: [...caseToAssociate.documents, answerDocumentMetadata],
  }).validate();

  await applicationContext.getPersistenceGateway().associateAnswerToCase({
    user,
    caseToAssociate: caseWithAnswerAndRespondent.toJSON(),
    applicationContext,
  });

  return {
    createdAt: new Date().toISOString(),
  };
};
