const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.saveIntermediateDocketEntryInteractor = async ({
  applicationContext,
  entryMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId } = entryMetadata;

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const initialDocketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === entryMetadata.documentId,
  );

  const docketRecordEntry = new DocketRecord({
    ...initialDocketEntry,
    editState: JSON.stringify(entryMetadata),
  });

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));

  const currentDocument = caseEntity.getDocumentById({
    documentId: entryMetadata.documentId,
  });

  const workItemsToPutInProgress = currentDocument.workItems
    .filter(wi => wi.isQC === true)
    .filter(wi => !wi.inProgress);

  const workItemUpdates = [];
  for (const workItemToUpdate of workItemsToPutInProgress) {
    Object.assign(workItemToUpdate, {
      inProgress: true,
    });

    const rawWorkItem = workItemToUpdate.validate().toRawObject();

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().updateWorkItem({
        applicationContext,
        workItemToUpdate: rawWorkItem,
      }),
    );

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().createUserInboxRecord({
        applicationContext,
        workItem: rawWorkItem,
      }),
    );

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().createSectionInboxRecord({
        applicationContext,
        workItem: rawWorkItem,
      }),
    );
  }
  await Promise.all(workItemUpdates);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
