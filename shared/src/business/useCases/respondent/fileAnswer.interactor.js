const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Document = require('../../entities/Document');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  answerDocument,
  applicationContext,
}) => {
  //validate the pdf
  if (!answerDocument) {
    throw new UnprocessableEntityError(
      'answer document cannot be null or invalid',
    );
  }

  const user = await applicationContext.getUseCases().getUser(userId);

  //upload to S3 return uuid
  const answerDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      answerDocument,
    });

  const answerDocumentMetadata = {
    documentType: Case.documentTypes.answer,
    documentId: answerDocumentId,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  const caseWithAnswer = new Case({
    ...caseToUpdate,
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
    documents: [...caseToUpdate.documents, answerDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());

  const updatedCase = await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseDetails: caseWithAnswer.toJSON(),
    userId,
    applicationContext,
  });

  new Case(updatedCase).validate();

  return new Document(answerDocumentMetadata).validate().toJSON();
};
