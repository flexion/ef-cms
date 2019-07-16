const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { capitalize, pick } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param documentMetadata
 * @param documentIds
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileExternalDocumentInteractor = async ({
  applicationContext,
  documentIds,
  documentMetadata,
}) => {
  const user = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate);
  const workItems = [];

  const {
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyRespondent',
    'practitioner',
    'caseId',
    'docketNumber',
  ]);

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
  }
  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.secondarySupportingDocumentMetadata.lodged = true;
    });
  }

  const documentsToAdd = [
    [documentIds.shift(), primaryDocumentMetadata, 'primaryDocument'],
  ];

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        supportingDocuments[i].supportingDocumentMetadata,
        'primarySupportingDocument',
      ]);
    }
  }

  documentsToAdd.push([
    documentIds.shift(),
    secondaryDocument,
    'secondaryDocument',
  ]);

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        secondarySupportingDocuments[i].secondarySupportingDocumentMetadata,
        'secondarySupportingDocument',
      ]);
    }
  }

  documentsToAdd.forEach(([documentId, metadata, relationship]) => {
    if (documentId && metadata) {
      const documentEntity = new Document({
        ...baseMetadata,
        ...metadata,
        relationship,
        documentId,
        documentType: metadata.documentType,
        userId: user.userId,
      });
      documentEntity.generateFiledBy(caseToUpdate);

      const workItem = new WorkItem({
        assigneeId: null,
        assigneeName: null,
        caseId: caseId,
        caseStatus: caseToUpdate.status,
        docketNumber: caseToUpdate.docketNumber,
        docketNumberSuffix: caseToUpdate.docketNumberSuffix,
        document: {
          ...documentEntity.toRawObject(),
          createdAt: documentEntity.createdAt,
        },
        isInternal: false,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      const message = new Message({
        from: user.name,
        fromUserId: user.userId,
        message: `${documentEntity.documentType} filed by ${capitalize(
          user.role,
        )} is ready for review.`,
      });

      workItem.addMessage(message);
      documentEntity.addWorkItem(workItem);

      if (metadata.isPaper) {
        workItem.setAsCompleted({
          message: 'completed',
          user,
        });

        workItem.assignToUser({
          assigneeId: user.userId,
          assigneeName: user.name,
          role: user.role,
          sentBy: user.name,
          sentByUserId: user.userId,
          sentByUserRole: user.role,
        });
      }

      workItems.push(workItem);
      caseEntity.addDocumentWithoutDocketRecord(documentEntity);

      const docketRecordEntity = new DocketRecord({
        description: metadata.documentTitle,
        documentId: documentEntity.documentId,
        filingDate: documentEntity.receivedAt,
      });
      caseEntity.addDocketRecord(docketRecordEntity);
    }
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  for (let workItem of workItems) {
    if (workItem.document.isPaper) {
      await applicationContext
        .getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument({
          applicationContext,
          workItem: workItem.validate().toRawObject(),
        });
    } else {
      await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
    }
  }

  return caseEntity.toRawObject();
};
