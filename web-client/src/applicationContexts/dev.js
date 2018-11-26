import persistenceGateway from 'ef-cms-shared/src/persistence/awsPersistenceGateway';

import createCase from 'ef-cms-shared/src/useCases/createCaseProxy';
import getCase from 'ef-cms-shared/src/useCases/getCaseProxy';
import getCasesByStatus from 'ef-cms-shared/src/useCases/getCasesByStatusProxy';
import getCasesByUser from 'ef-cms-shared/src/useCases/getCasesByUserProxy';
import getUser from 'ef-cms-shared/src/useCases/getUser';
import updateCase from 'ef-cms-shared/src/useCases/updateCaseProxy';
import uploadCasePdfs from 'ef-cms-shared/src/useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
