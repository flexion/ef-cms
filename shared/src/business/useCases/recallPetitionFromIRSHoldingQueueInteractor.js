const {
  createUserInboxRecord,
} = require('../../persistence/dynamo/workitems/createUserInboxRecord');
const {
  InvalidEntityError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors/errors');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');

const {
  createSectionInboxRecord,
} = require('../../persistence/dynamo/workitems/createSectionInboxRecord');
const {
  deleteSectionOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteSectionOutboxRecord');
const {
  deleteUserOutboxRecord,
} = require('../../persistence/dynamo/workitems/deleteUserOutboxRecord');
const {
  deleteWorkItemFromInbox,
} = require('../../persistence/dynamo/workitems/deleteWorkItemFromInbox');
/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.recallPetitionFromIRSHoldingQueue = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError(
      'Unauthorized for recall from IRS Holding Queue',
    );
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseRecord) throw new NotFoundError(`Case ${caseId} was not found`);

  const caseEntity = new Case(caseRecord).validate();

  const petitionDocument = caseEntity.documents.find(
    document =>
      document.documentType === Document.initialDocumentTypes.petitionFile,
  );

  const initializeCaseWorkItem = petitionDocument.workItems.find(
    workItem => workItem.isInitializeCase,
  );

  for (let workItem of caseEntity.getWorkItems()) {
    workItem.setStatus(Case.STATUS_TYPES.recalled);

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: workItem.toRawObject(),
    });
  }

  if (initializeCaseWorkItem) {
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: initializeCaseWorkItem,
    });

    initializeCaseWorkItem.recallFromIRSBatchSystem({
      user,
    });
    const invalidEntityError = new InvalidEntityError(
      'Invalid for recall from IRS',
    );
    caseEntity.validateWithError(invalidEntityError);

    caseEntity
      .recallFromIRSHoldingQueue()
      .validateWithError(invalidEntityError);

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.toRawObject(),
    });

    const batchedMessage = initializeCaseWorkItem.messages.find(
      message => message.message === 'Petition batched for IRS',
    );

    const { fromUserId } = batchedMessage;
    const { createdAt } = initializeCaseWorkItem;

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: initializeCaseWorkItem.toRawObject(),
    });

    await deleteUserOutboxRecord({
      applicationContext,
      createdAt,
      userId: fromUserId,
    });

    await deleteSectionOutboxRecord({
      applicationContext,
      createdAt,
      section: 'petitions',
    });

    await createUserInboxRecord({
      applicationContext,
      workItem: initializeCaseWorkItem,
    });

    await createSectionInboxRecord({
      applicationContext,
      workItem: initializeCaseWorkItem,
    });

    return caseEntity.toRawObject();
  } else {
    throw new NotFoundError(
      `Petition workItem for Case ${caseId} was not found`,
    );
  }
};
