const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * addCoversheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 * @returns {Uint8Array} the new pdf data
 */
exports.addCoversheetInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const document = caseEntity.getDocumentById({ documentId });

  if (document.isCoversheetAttached()) {
    throw new Error('cover sheet is already added to document');
  }

  await applicationContext.getUseCaseHelpers().addCoversheetToDocument({
    applicationContext,
    caseId,
    documentId,
  });
};
