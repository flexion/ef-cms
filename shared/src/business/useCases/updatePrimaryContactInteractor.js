const {
  addCoverToPdf,
} = require('../../business/useCases/addCoverToPDFDocumentInteractor');
const { capitalize } = require('lodash');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

/**
 * updatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the primary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {object} the updated case
 */
exports.updatePrimaryContactInteractor = async ({
  applicationContext,
  caseId,
  contactInfo,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (user.userId !== caseToUpdate.userId) {
    throw new UnauthorizedError('Unauthorized for update case contact');
  }

  const caseEntity = new Case(caseToUpdate);
  const caseName = Case.getCaseCaptionNames(caseEntity.caseCaption);

  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: contactInfo,
      oldData: caseEntity.contactPrimary,
    });

  const pdfContentHtml = applicationContext
    .getUtilities()
    .generateChangeOfAddressTemplate({
      caseDetail: {
        ...caseEntity.toRawObject(),
        caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
      },
      documentTitle: documentType.title,
      name: caseName,
      newData: contactInfo,
      oldData: caseEntity.contactPrimary,
    });

  caseEntity.contactPrimary = ContactFactory.createContacts({
    contactInfo: { primary: contactInfo },
    partyType: caseEntity.partyType,
  }).primary.toRawObject();

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: caseEntity.docketNumber,
      headerHtml: null,
    });

  const newDocumentId = applicationContext.getUniqueId();

  const changeOfAddressDocument = new Document({
    additionalInfo2: `for ${caseName}`,
    caseId,
    documentId: newDocumentId,
    documentType: documentType.title,
    eventCode: documentType.eventCode,
    filedBy: user.name,
    processingStatus: 'complete',
    userId: user.userId,
  });

  const workItem = new WorkItem({
    assigneeId: null,
    assigneeName: null,
    caseId,
    caseStatus: caseEntity.status,
    docketNumber: caseEntity.docketNumber,
    docketNumberSuffix: caseEntity.docketNumberSuffix,
    document: {
      ...changeOfAddressDocument.toRawObject(),
      createdAt: changeOfAddressDocument.createdAt,
    },
    isInternal: false,
    section: DOCKET_SECTION,
    sentBy: user.userId,
  });

  const message = new Message({
    from: user.name,
    fromUserId: user.userId,
    message: `${changeOfAddressDocument.documentType} filed by ${capitalize(
      user.role,
    )} is ready for review.`,
  });

  workItem.addMessage(message);
  changeOfAddressDocument.addWorkItem(workItem);

  caseEntity.addDocument(changeOfAddressDocument);

  const docketRecordPdfWithCover = await addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity: changeOfAddressDocument,
    pdfData: docketRecordPdf,
  });

  await applicationContext.getPersistenceGateway().saveDocument({
    applicationContext,
    document: docketRecordPdfWithCover,
    documentId: newDocumentId,
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: workItem,
  });

  const rawCase = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: rawCase,
  });

  return rawCase;
};
