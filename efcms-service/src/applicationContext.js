const {
  incrementCounter,
} = require('ef-cms-shared/src/persistence/awsDynamoPersistence');

const { getWorkItemsForUser } = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemsForUser');
const { getWorkItemById } = require('ef-cms-shared/src/persistence/dynamo/workitems/getWorkItemById');
const { saveWorkItem } = require('ef-cms-shared/src/persistence/dynamo/workitems/saveWorkItem');

// cases
const { getCasesByDocumentId } = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByDocumentId');
const { getCasesByStatus } = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByStatus');
const { getCasesByUser } = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesByUser');
const { getCasesForRespondent } = require('ef-cms-shared/src/persistence/dynamo/cases/getCasesForRespondent');
const { saveCase } = require('ef-cms-shared/src/persistence/dynamo/cases/saveCase');
const { createCase } = require('ef-cms-shared/src/persistence/dynamo/cases/createCase');
const { getCaseByCaseId } = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByCaseId');
const { getCaseByDocketNumber } = require('ef-cms-shared/src/persistence/dynamo/cases/getCaseByDocketNumber');

const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');

const { uploadPdfsForNewCase, uploadPdf } = require('ef-cms-shared/src/persistence/awsS3Persistence');
const { getUploadPolicy } = require('ef-cms-shared/src/persistence/getUploadPolicy');
const { getDownloadPolicyUrl } = require('ef-cms-shared/src/persistence/getDownloadPolicyUrl');

const irsGateway = require('ef-cms-shared/src/external/irsGateway');
const { getCase } = require('ef-cms-shared/src/business/useCases/getCase.interactor');
const { getCases } = require('ef-cms-shared/src/business/useCases/getCases.interactor');
const { getCasesByStatus: getCasesByStatusUC } = require('ef-cms-shared/src/business/useCases/getCasesByStatus.interactor');
const { createCase: createCaseUC } = require('ef-cms-shared/src/business/useCases/createCase.interactor');
const { getCasesByUser: getCasesByUserUC } = require('ef-cms-shared/src/business/useCases/getCasesByUser.interactor');
const { getUser } = require('ef-cms-shared/src/business/useCases/getUser.interactor');
const { sendPetitionToIRS } = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS.interactor');
const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase.interactor');
const { uploadCasePdfs } = require('ef-cms-shared/src/business/useCases/uploadCasePdfs.interactor');
const { getCasesForRespondent: getCasesForRespondentUC } = require('ef-cms-shared/src/business/useCases/respondent/getCasesForRespondent.interactor');
const { getWorkItem } = require('ef-cms-shared/src/business/useCases/workitems/getWorkItem.interactor');
const { getWorkItems } = require('ef-cms-shared/src/business/useCases/workitems/getWorkItems.interactor');
const { updateWorkItem } = require('ef-cms-shared/src/business/useCases/workitems/updateWorkItem.interactor');
const { associateRespondentDocumentToCase } = require('ef-cms-shared/src/business/useCases/respondent/associateRespondentDocumentToCase.interactor');
const { getInteractorForGettingCases } = require('ef-cms-shared/src/business/useCases/utilities/getInteractorForGettingCases');

const {
  isAuthorized,
  WORKITEM
} = require('ef-cms-shared/src/authorization/authorizationClientService');

const User = require('ef-cms-shared/src/business/entities/User');

module.exports = ({userId} = {}) => {
  let user;
  if (userId) {
    user = new User({userId});
  }
  return {
    getPersistenceGateway: () => {
      return {
        incrementCounter,
        uploadPdfsForNewCase,
        uploadPdf,
        getUploadPolicy,
        getDownloadPolicyUrl,
        getWorkItemsForUser,
        getWorkItemById,
        saveWorkItem,

        // cases
        getCasesByStatus,
        getCasesByDocumentId,
        getCasesByUser,
        getCasesForRespondent,
        saveCase,
        createCase,
        getCaseByCaseId,
        getCaseByDocketNumber,
      }

    },
    docketNumberGenerator,
    irsGateway,
    environment: {
      stage: process.env.STAGE || 'local',
      region: process.env.AWS_REGION || 'us-east-1',
      s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
      documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
    },
    user,
    isAuthorized,
    isAuthorizedForWorkItems: () => isAuthorized(user, WORKITEM),
    getUseCases: () => {
      return {
        createCase: createCaseUC,
        getCase,
        getCases,
        getCasesByStatus: getCasesByStatusUC,
        getCasesByUser: getCasesByUserUC,
        getUser,
        sendPetitionToIRS,
        updateCase,
        uploadCasePdfs,
        getCasesForRespondent: getCasesForRespondentUC,
        getWorkItem,
        getWorkItems,
        updateWorkItem,
        associateRespondentDocumentToCase,
      };
    },
    getUpdateCaseInteractorQueryParam: event => {
      const interactorName = (event.queryStringParameters || {}).interactorName || "updateCase";
      switch (interactorName) {
      case "associateRespondentDocumentToCase":
        return associateRespondentDocumentToCase;
      default:
        return updateCase;
      }
    },
    getInteractorForGettingCases,
  };
}
