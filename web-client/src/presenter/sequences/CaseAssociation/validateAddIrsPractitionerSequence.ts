import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { sequence } from 'cerebral';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddIrsPractitionerAction } from '../../actions/CaseAssociation/validateAddIrsPractitionerAction';

export const validateAddIrsPractitionerSequence = sequence([
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddIrsPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
]);
