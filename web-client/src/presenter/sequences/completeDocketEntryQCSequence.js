import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPaperServicePartiesAction } from '../actions/setPaperServicePartiesAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const completeDocketEntryQCSequence = [
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  formHasSecondaryDocumentAction,
  {
    no: [],
    yes: [
      setComputeFormDayFactoryAction('secondaryDocument.serviceDateDay'),
      setComputeFormMonthFactoryAction('secondaryDocument.serviceDateMonth'),
      setComputeFormYearFactoryAction('secondaryDocument.serviceDateYear'),
      getComputedFormDateFactoryAction('secondaryDocument.serviceDate'),
      setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
    ],
  },
  computeCertificateOfServiceFormDateAction,
  setComputeFormDayFactoryAction('dateReceivedDay'),
  setComputeFormMonthFactoryAction('dateReceivedMonth'),
  setComputeFormYearFactoryAction('dateReceivedYear'),
  getComputedFormDateFactoryAction('dateReceived'),
  setComputeFormDateFactoryAction('dateReceived'),
  setComputeFormDayFactoryAction('serviceDateDay'),
  setComputeFormMonthFactoryAction('serviceDateMonth'),
  setComputeFormYearFactoryAction('serviceDateYear'),
  getComputedFormDateFactoryAction('serviceDate'),
  setComputeFormDateFactoryAction('serviceDate'),
  validateDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      setCurrentPageAction('Interstitial'),
      refreshExternalDocumentTitleFromEventCodeAction,
      generateTitleAction,
      completeDocketEntryQCAction,
      setPdfPreviewUrlAction,
      setCaseAction,
      setAlertSuccessAction,
      setPaperServicePartiesAction,
      setSaveAlertsForNavigationAction,
      navigateToDocumentQCAction,
      clearErrorAlertsAction,
    ],
  },
];
