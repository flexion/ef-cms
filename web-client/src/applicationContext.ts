/* eslint-disable max-lines */
import { BroadcastChannel } from 'broadcast-channel';
import {
  Case,
  canAllowDocumentServiceForCase,
  caseHasServedDocketEntries,
  caseHasServedPetition,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  hasPartyWithServiceType,
  isClosed,
  isLeadCase,
  isSealedCase,
  isUserPartOfGroup,
  userIsDirectlyAssociated,
} from '../../shared/src/business/entities/cases/Case';
import {
  DocketEntry,
  getServedPartiesCode,
} from '../../shared/src/business/entities/DocketEntry';
import {
  ERROR_MAP_429,
  clerkOfCourtNameForSigning,
  getCognitoLocalEnabled,
  getCognitoLoginUrl,
  getEnvironment,
  getPublicSiteUrl,
  getUniqueId,
} from '../../shared/src/sharedAppContext';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { User } from '../../shared/src/business/entities/User';
import { abbreviateState } from '../../shared/src/business/utilities/abbreviateState';
import { aggregatePartiesForService } from '../../shared/src/business/utilities/aggregatePartiesForService';
import { allUseCases } from '@web-client/clientUseCases';
import { calculateDaysElapsedSinceLastStatusChange } from '../../shared/src/business/utilities/calculateDaysElapsedSinceLastStatusChange';
import {
  calculateDifferenceInDays,
  calculateISODate,
  checkDate,
  computeDate,
  createEndOfDayISO,
  createISODateString,
  createISODateStringFromObject,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  getDateFormat,
  getMonthDayYearInETObj,
  isStringISOFormatted,
  isTodayWithinGivenInterval,
  isValidDateString,
  prepareDateFromString,
  validateDateAndCreateISO,
} from '../../shared/src/business/utilities/DateHandler';
import {
  compareCasesByDocketNumber,
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { filterEmptyStrings } from '../../shared/src/business/utilities/filterEmptyStrings';
import { formatAttachments } from '../../shared/src/business/utilities/formatAttachments';
import {
  formatCase,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { formatDollars } from '../../shared/src/business/utilities/formatDollars';
import {
  formatJudgeName,
  getJudgeLastName,
} from '../../shared/src/business/utilities/getFormattedJudgeName';
import { formatPhoneNumber } from '../../shared/src/business/utilities/formatPhoneNumber';
import { generateCourtIssuedDocumentTitle } from '../../shared/src/business/useCases/courtIssuedDocument/generateCourtIssuedDocumentTitle';
import { generateExternalDocumentTitle } from '../../shared/src/business/useCases/externalDocument/generateExternalDocumentTitle';
import {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
} from './business/chambers/getJudgesChambers';
import { getClinicLetterKey } from '../../shared/src/business/utilities/getClinicLetterKey';
import { getConstants } from './getConstants';
import { getCropBox } from '../../shared/src/business/utilities/getCropBox';
import { getDescriptionDisplay } from '../../shared/src/business/utilities/getDescriptionDisplay';
import {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} from '../../shared/src/business/utilities/getWorkQueueFilters';
import { getDocument } from '@web-client/persistence/s3/getDocument';
import { getDocumentTitleWithAdditionalInfo } from '../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getFormattedPartiesNameAndTitle } from '../../shared/src/business/utilities/getFormattedPartiesNameAndTitle';
import { getHttpClient } from '@web-client/providers/httpClient';
import { getIsFeatureEnabled } from '../../shared/src/business/utilities/getIsFeatureEnabled';
import { getItem } from './persistence/localStorage/getItem';
import { getPdfFromUrl } from '@web-client/persistence/s3/getPdfFromUrl';
import { getScannerInterface } from './persistence/dynamsoft/getScannerInterface';
import { getScannerMockInterface } from './persistence/dynamsoft/getScannerMockInterface';
import { getSealedDocketEntryTooltip } from '../../shared/src/business/utilities/getSealedDocketEntryTooltip';
import { getStampBoxCoordinates } from '../../shared/src/business/utilities/getStampBoxCoordinates';
import { getStandaloneRemoteDocumentTitle } from '../../shared/src/business/utilities/getStandaloneRemoteDocumentTitle';
import { getTrialSessionsForJudgeInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsForJudgeProxy';
import { getUserPermissions } from '../../shared/src/authorization/getUserPermissions';
import { openUrlInNewTab } from './presenter/utilities/openUrlInNewTab';
import { removeItem } from './persistence/localStorage/removeItem';
import { replaceBracketed } from '../../shared/src/business/utilities/replaceBracketed';
import { setConsolidationFlagsForDisplay } from '../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { setItem } from './persistence/localStorage/setItem';
import { setServiceIndicatorsForCase } from '../../shared/src/business/utilities/setServiceIndicatorsForCase';
import { setupPdfDocument } from '../../shared/src/business/utilities/setupPdfDocument';
import { transformFormValueToTitleCaseOrdinal } from '../../shared/src/business/utilities/transformFormValueToTitleCaseOrdinal';
import { uploadDocumentFromClient } from '@web-client/persistence/s3/uploadDocumentFromClient';
import { uploadPdfFromClient } from '@web-client/persistence/s3/uploadPdfFromClient';
import ImageBlobReduce from 'image-blob-reduce';
import deepFreeze from 'deep-freeze';

const reduce = ImageBlobReduce({
  pica: ImageBlobReduce.pica({ features: ['js'] }),
});

let user;
let broadcastChannel;

const getCurrentUser = (): RawUser | RawPractitioner | RawIrsPractitioner => {
  return user;
};
const setCurrentUser = (
  newUser: RawUser | RawPractitioner | RawIrsPractitioner,
) => {
  user = newUser;
};

let token;
const getCurrentUserToken = () => {
  return token;
};
const setCurrentUserToken = newToken => {
  token = newToken;
};

const appConstants = deepFreeze({
  ...getConstants(),
  ERROR_MAP_429,
}) as ReturnType<typeof getConstants>;

const applicationContext = {
  convertBlobToUInt8Array: async blob => {
    return new Uint8Array(await new Response(blob).arrayBuffer());
  },
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:4000';
  },
  getBroadcastGateway: () => {
    if (!broadcastChannel) {
      broadcastChannel = new BroadcastChannel(getConstants().CHANNEL_NAME);
    }
    return broadcastChannel;
  },
  getCaseTitle: Case.getCaseTitle,
  getClerkOfCourtNameForSigning: () => clerkOfCourtNameForSigning,
  getCognitoClientId: () => {
    return process.env.COGNITO_CLIENT_ID || '6tu6j1stv5ugcut7dqsqdurn8q';
  },
  getCognitoLocalEnabled,
  getCognitoLoginUrl,
  getCognitoRedirectUrl: () => {
    return process.env.COGNITO_REDIRECT_URI || 'http://localhost:1234/log-in';
  },
  getCognitoTokenUrl: () => {
    return (
      process.env.COGNITO_TOKEN_URL ||
      'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/oauth2/token'
    );
  },
  getConstants: () => appConstants,
  getCurrentUser,
  getCurrentUserPermissions: () => {
    const currentUser = getCurrentUser();
    return getUserPermissions(currentUser);
  },
  getCurrentUserToken,
  getEnvironment,
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getFileReaderInstance: () => new FileReader(),
  getHttpClient,
  getLogger: () => ({
    error: value => {
      // eslint-disable-next-line no-console
      console.error(value);
    },
    info: (key, value) => {
      // eslint-disable-next-line no-console
      console.info(key, JSON.stringify(value));
    },
    time: key => {
      // eslint-disable-next-line no-console
      console.time(key);
    },
    timeEnd: key => {
      // eslint-disable-next-line no-console
      console.timeEnd(key);
    },
  }),
  getPdfJs: async () => {
    const pdfjsLib = (await import('pdfjs-dist')).default;
    const pdfjsWorker = (await import('pdfjs-dist/build/pdf.worker.entry'))
      .default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    return pdfjsLib;
  },
  getPdfLib: () => {
    const pdfLib = import('pdf-lib');
    return pdfLib;
  },
  getPersistenceGateway: () => {
    return {
      getChambersSections,
      getChambersSectionsLabels,
      getDocument,
      getItem,
      getPdfFromUrl,
      removeItem,
      setItem,
      uploadDocumentFromClient,
      uploadPdfFromClient,
    };
  },
  getPublicSiteUrl,
  getReduceImageBlob: () => reduce,
  getScanner: () => {
    if (process.env.NO_SCANNER) {
      return getScannerMockInterface();
    } else {
      return getScannerInterface();
    }
  },
  getScannerResourceUri: () => {
    return (
      process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
    );
  },
  getTrialSessionsForJudgeInteractor,
  getUniqueId,
  getUseCases: () => allUseCases,
  getUserPermissions,
  getUtilities: () => {
    return {
      abbreviateState,
      aggregatePartiesForService,
      calculateDaysElapsedSinceLastStatusChange,
      calculateDifferenceInDays,
      calculateISODate,
      canAllowDocumentServiceForCase,
      caseHasServedDocketEntries,
      caseHasServedPetition,
      checkDate,
      compareCasesByDocketNumber,
      compareISODateStrings,
      compareStrings,
      computeDate,
      createEndOfDayISO,
      createISODateString,
      createISODateStringFromObject,
      createStartOfDayISO,
      dateStringsCompared,
      deconstructDate,
      filterEmptyStrings,
      formatAttachments,
      formatCase,
      formatCaseForTrialSession,
      formatDateString,
      formatDocketEntry,
      formatDollars,
      formatJudgeName,
      formatNow,
      formatPhoneNumber,
      generateCourtIssuedDocumentTitle,
      generateExternalDocumentTitle,
      getAttachmentDocumentById: Case.getAttachmentDocumentById,
      getCaseCaption: Case.getCaseCaption,
      getClinicLetterKey,
      getContactPrimary,
      getContactSecondary,
      getCropBox,
      getDateFormat,
      getDescriptionDisplay,
      getDocQcSectionForUser,
      getDocumentTitleWithAdditionalInfo,
      getFilingsAndProceedings,
      getFormattedCaseDetail,
      getFormattedPartiesNameAndTitle,
      getFormattedTrialSessionDetails,
      getJudgeLastName,
      getJudgesChambers,
      getMonthDayYearInETObj,
      getOtherFilers,
      getPetitionDocketEntry,
      getPetitionerById,
      getPractitionersRepresenting,
      getSealedDocketEntryTooltip,
      getServedPartiesCode,
      getSortableDocketNumber: Case.getSortableDocketNumber,
      getStampBoxCoordinates,
      getStandaloneRemoteDocumentTitle,
      getWorkQueueFilters,
      hasPartyWithServiceType,
      isClosed,
      isCourtIssued: DocketEntry.isCourtIssued,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      isLeadCase,
      isPending: DocketEntry.isPending,
      isPendingOnCreation: DocketEntry.isPendingOnCreation,
      isSealedCase,
      isStringISOFormatted,
      isTodayWithinGivenInterval,
      isUserPartOfGroup,
      isValidDateString,
      openUrlInNewTab,
      prepareDateFromString,
      replaceBracketed,
      setConsolidationFlagsForDisplay,
      setServiceIndicatorsForCase,
      setupPdfDocument,
      sortDocketEntries,
      transformFormValueToTitleCaseOrdinal,
      userIsDirectlyAssociated,
      validateDateAndCreateISO,
    };
  },
  isFeatureEnabled: featureName => {
    return getIsFeatureEnabled(featureName, user, getEnvironment().stage);
  },
  setCurrentUser,
  setCurrentUserToken,
};

export { applicationContext };

export type ClientApplicationContext = typeof applicationContext;
