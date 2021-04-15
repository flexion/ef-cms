import { clearAlertsAction } from '../actions/clearAlertsAction';
import { hasUpdatedPetitionerEmailAction } from '../actions/hasUpdatedPetitionerEmailAction';
import { openGainElectronicAccessToCaseModalSequence } from './openGainElectronicAccessToCaseModalSequence';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitUpdatePetitionerInformationSequence } from './submitUpdatePetitionerInformationSequence';
import { validateAddPetitionerAction } from '../actions/validateAddPetitionerAction';

export const submitAddPetitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateAddPetitionerAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      // hasUpdatedPetitionerEmailAction,
      // {
      //   no: [submitUpdatePetitionerInformationSequence],
      //   yes: [openGainElectronicAccessToCaseModalSequence],
      // },
    ]),
  },
];
