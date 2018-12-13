const {
  uploadPdf,
  uploadPdfsForNewCase,
  uploadDocument,
  getDocument,
} = require('../../../shared/src/persistence/awsS3Persistence');

import { createCase } from '../../../shared/src/proxies/createCaseProxy';
import { getCase } from '../../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../../shared/src/proxies/getCasesByUserProxy';
import { getUser } from '../../../shared/src/business/useCases/getUser.interactor';
import { sendPetitionToIRS } from '../../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../../shared/src/proxies/updateCaseProxy';
import { uploadCasePdfs } from '../../../shared/src/business/useCases/uploadCasePdfs.interactor';
import { downloadDocumentFile } from '../../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileAnswer } from '../../../shared/src/business/useCases/respondent/fileAnswer.interactor';
import { getCasesForRespondent } from '../../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { fileStipulatedDecision } from '../../../shared/src/business/useCases/respondent/fileStipulatedDecision.interactor';

import Case from '../../../shared/src/business/entities/Case';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return {
      uploadPdf,
      uploadPdfsForNewCase,
      uploadDocument,
      getDocument,
      saveCase: updateCase,
    };
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
      fileAnswer,
      getCasesForRespondent,
      downloadDocumentFile,
    };
  },
  getUseCaseForDocumentUpload: (documentType, role) => {
    // TODO put user in so we can remove role
    if (role === 'respondent') {
      switch (documentType) {
        case Case.documentTypes.answer:
          return fileAnswer;
        case Case.documentTypes.stipulatedDecision:
          return fileStipulatedDecision;
        default:
          return updateCase;
      }
    }
  },
};

export default applicationContext;
