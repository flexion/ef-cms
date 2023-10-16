import { ActionError } from './errors/ActionError';
import { InvalidRequestError } from './errors/InvalidRequestError';
import { NotFoundError } from './errors/NotFoundError';
import { ServerInvalidResponseError } from './errors/ServerInvalidResponseError';
import { advancedSearchTabChangeSequence } from './sequences/advancedSearchTabChangeSequence';
import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { closeModalAndNavigateToMaintenanceSequence } from './sequences/closeModalAndNavigateToMaintenanceSequence';
import { dismissModalSequence } from './sequences/dismissModalSequence';
import { goToCreatePetitionerAccountSequence } from '@web-client/presenter/sequences/Public/goToCreatePetitionerAccountSequence';
import { gotoContactSequence } from './sequences/gotoContactSequence';
import { gotoHealthCheckSequence } from './sequences/gotoHealthCheckSequence';
import { gotoMaintenanceSequence } from './sequences/gotoMaintenanceSequence';
import { gotoPrivacySequence } from './sequences/gotoPrivacySequence';
import { gotoPublicCaseDetailSequence } from './sequences/Public/gotoPublicCaseDetailSequence';
import { gotoPublicEmailVerificationInstructionsSequence } from './sequences/gotoPublicEmailVerificationInstructionsSequence';
import { gotoPublicEmailVerificationSuccessSequence } from './sequences/gotoPublicEmailVerificationSuccessSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/Public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/Public/gotoPublicSearchSequence';
import { gotoTodaysOpinionsSequence } from './sequences/Public/gotoTodaysOpinionsSequence';
import { gotoTodaysOrdersSequence } from './sequences/Public/gotoTodaysOrdersSequence';
import { initialPublicState } from './state-public';
import { loadMoreTodaysOrdersSequence } from './sequences/loadMoreTodaysOrdersSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToCreatePetitionerAccountSequence } from '@web-client/presenter/sequences/navigateToCreatePetitionerAccountSequence';
import { navigateToPublicSiteSequence } from './sequences/Public/navigateToPublicSiteSequence';
import { notFoundErrorSequence } from './sequences/notFoundErrorSequence';
import { openAppMaintenanceModalSequence } from './sequences/openAppMaintenanceModalSequence';
import { openCaseDocumentDownloadUrlSequence } from './sequences/openCaseDocumentDownloadUrlSequence';
import { persistFormsOnReloadSequence } from './sequences/persistFormsOnReloadSequence';
import { setCurrentPageErrorSequence } from './sequences/setCurrentPageErrorSequence';
import { showMaintenancePageDecorator } from './utilities/showMaintenancePageDecorator';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { sortTodaysOrdersSequence } from './sequences/Public/sortTodaysOrdersSequence';
import { submitPublicCaseAdvancedSearchSequence } from './sequences/Public/submitPublicCaseAdvancedSearchSequence';
import { submitPublicCaseDocketNumberSearchSequence } from './sequences/Public/submitPublicCaseDocketNumberSearchSequence';
import { submitPublicOpinionAdvancedSearchSequence } from './sequences/Public/submitPublicOpinionAdvancedSearchSequence';
import { submitPublicOrderAdvancedSearchSequence } from './sequences/Public/submitPublicOrderAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleMobileDocketSortSequence } from './sequences/toggleMobileDocketSortSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedOpinionSearchFormValueSequence } from './sequences/updateAdvancedOpinionSearchFormValueSequence';
import { updateAdvancedOrderSearchFormValueSequence } from './sequences/updateAdvancedOrderSearchFormValueSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateCaseAdvancedSearchByNameFormValueSequence } from './sequences/updateCaseAdvancedSearchByNameFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';
import { updateSessionMetadataSequence } from './sequences/updateSessionMetadataSequence';
import { validateCaseAdvancedSearchFormSequence } from './sequences/validateCaseAdvancedSearchFormSequence';
import { validateCaseDocketNumberSearchFormSequence } from './sequences/validateCaseDocketNumberSearchFormSequence';
import { validateOpinionSearchSequence } from './sequences/validateOpinionSearchSequence';
import { validateOrderSearchSequence } from './sequences/validateOrderSearchSequence';

export const presenterSequences = {
  advancedSearchTabChangeSequence,
  cerebralBindSimpleSetStateSequence,
  clearAdvancedSearchFormSequence,
  clearPdfPreviewUrlSequence,
  closeModalAndNavigateToMaintenanceSequence,
  dismissModalSequence,
  goToCreatePetitionerAccountSequence,
  gotoContactSequence: showMaintenancePageDecorator(gotoContactSequence),
  gotoHealthCheckSequence: showMaintenancePageDecorator(
    gotoHealthCheckSequence,
  ),
  gotoMaintenanceSequence,
  gotoPrivacySequence: showMaintenancePageDecorator(gotoPrivacySequence),
  gotoPublicCaseDetailSequence: showMaintenancePageDecorator(
    gotoPublicCaseDetailSequence,
  ),
  gotoPublicEmailVerificationInstructionsSequence: showMaintenancePageDecorator(
    gotoPublicEmailVerificationInstructionsSequence,
  ),
  gotoPublicEmailVerificationSuccessSequence: showMaintenancePageDecorator(
    gotoPublicEmailVerificationSuccessSequence,
  ),
  gotoPublicPrintableDocketRecordSequence,
  gotoPublicSearchSequence: showMaintenancePageDecorator(
    gotoPublicSearchSequence,
  ),
  gotoTodaysOpinionsSequence: showMaintenancePageDecorator(
    gotoTodaysOpinionsSequence,
  ),
  gotoTodaysOrdersSequence: showMaintenancePageDecorator(
    gotoTodaysOrdersSequence,
  ),
  loadMoreTodaysOrdersSequence,
  navigateBackSequence,
  navigateToCognitoSequence,
  navigateToCreatePetitionerAccountSequence,
  navigateToPublicSiteSequence,
  notFoundErrorSequence,
  openAppMaintenanceModalSequence,
  openCaseDocumentDownloadUrlSequence,
  persistFormsOnReloadSequence,
  showMoreResultsSequence,
  sortTodaysOrdersSequence,
  submitPublicCaseAdvancedSearchSequence,
  submitPublicCaseDocketNumberSearchSequence,
  submitPublicOpinionAdvancedSearchSequence,
  submitPublicOrderAdvancedSearchSequence,
  toggleBetaBarSequence,
  toggleMobileDocketSortSequence,
  toggleUsaBannerDetailsSequence,
  updateAdvancedOpinionSearchFormValueSequence,
  updateAdvancedOrderSearchFormValueSequence,
  updateAdvancedSearchFormValueSequence,
  updateCaseAdvancedSearchByNameFormValueSequence,
  updateDocketNumberSearchFormSequence,
  updateSessionMetadataSequence,
  validateCaseAdvancedSearchFormSequence,
  validateCaseDocketNumberSearchFormSequence,
  validateOpinionSearchSequence,
  validateOrderSearchSequence,
};

export const presenter = {
  catch: [
    // ORDER MATTERS! Based on inheritance, the first match will be used
    [InvalidRequestError, setCurrentPageErrorSequence], // 418, other unknown 4xx series
    [ServerInvalidResponseError, setCurrentPageErrorSequence], // 501, 503, etc
    [NotFoundError, notFoundErrorSequence], //404
    [ActionError, setCurrentPageErrorSequence], // generic error handler
  ],
  providers: {},
  sequences: presenterSequences,
  state: initialPublicState,
};

export type Sequences = typeof presenterSequences;
