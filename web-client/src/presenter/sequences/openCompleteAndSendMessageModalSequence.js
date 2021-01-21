import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setComputeFormDayFactoryAction } from '../actions/setComputeFormDayFactoryAction';
import { setComputeFormMonthFactoryAction } from '../actions/setComputeFormMonthFactoryAction';
import { setComputeFormYearFactoryAction } from '../actions/setComputeFormYearFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { updateMessageModalAfterQCAction } from '../actions/updateMessageModalAfterQCAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCompleteAndSendMessageModalSequence = [
  formHasSecondaryDocumentAction,
  {
    no: [],
    yes: [
      setComputeFormDayFactoryAction('secondaryDocument.day'),
      setComputeFormMonthFactoryAction('secondaryDocument.month'),
      setComputeFormYearFactoryAction('secondaryDocument.year'),
      getComputedFormDateFactoryAction(null),
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
      clearModalStateAction,
      refreshExternalDocumentTitleFromEventCodeAction,
      generateTitleAction,
      updateMessageModalAfterQCAction,
      setShowModalFactoryAction('CreateMessageModalDialog'),
    ],
  },
];
