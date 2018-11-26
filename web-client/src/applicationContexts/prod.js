import awsPersistenceGateway from 'ef-cms-shared/src/persistence/awsPersistenceGateway';

import createCase from 'ef-cms-shared/src/useCases/createCaseProxy';
import createDocumentMetadata from 'ef-cms-shared/src/useCases/createDocumentMetadata';
import getCase from 'ef-cms-shared/src/useCases/getCaseProxy';
import getCasesByStatus from 'ef-cms-shared/src/useCases/getCasesByStatusProxy';
import getCasesByUser from 'ef-cms-shared/src/useCases/getCasesByUserProxy';
import getDocumentPolicy from 'ef-cms-shared/src/useCases/getDownloadPolicyUrl';
import getUser from 'ef-cms-shared/src/useCases/getUser';
import updateCase from 'ef-cms-shared/src/useCases/updateCaseProxy';
import uploadToS3 from 'ef-cms-shared/src/useCases/uploadCasePdfs';

const API_URL = process.env.API_URL || 'http://localhost:8080';

/**
 * Context for the prod environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return API_URL;
  },
  getPersistenceGateway: () => {
    return awsPersistenceGateway;
  },
  useCases: {
    createCase,
    createDocumentMetadata,
    getCase,
    getCasesByStatus,
    getCasesByUser,
    getDocumentPolicy,
    getUser,
    updateCase,
    uploadToS3,
  },
};

export default applicationContext;
