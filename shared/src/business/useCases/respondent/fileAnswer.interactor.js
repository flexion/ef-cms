const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  answerDocument,
  applicationContext,
}) => {
  if (!answerDocument) {
    throw new UnprocessableEntityError(
      'answer document cannot be null or invalid',
    );
  }

  const answerDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      answerDocument,
    });

  return await applicationContext.getUseCases().associateAnswerToCase({
    applicationContext,
    answer: {
      documentType: Case.documentTypes.answer,
      documentId: answerDocumentId,
    },
    caseId: caseToUpdate.caseId,
    userId: userId,
  });
};
