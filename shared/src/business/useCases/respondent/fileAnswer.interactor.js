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
    filedBy: `${user.firstName} ${user.lastName}`,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  const caseWithAnswer = new Case({
    ...caseToUpdate,
    documents: [...caseToUpdate.documents, answerDocumentMetadata],
  });

  caseWithAnswer.validateWithError(new UnprocessableEntityError());

  await applicationContext.getUseCases().updateCase({
    caseId: caseWithAnswer.caseId,
    caseDetails: caseWithAnswer.toJSON(),
    userId,
    applicationContext,
  });

  await applicationContext.getUseCases().associateRespondentToCase({
    caseId: caseToUpdate.caseId,
    userId,
    applicationContext,
  });

  return new Document(answerDocumentMetadata).validate().toJSON();
};
