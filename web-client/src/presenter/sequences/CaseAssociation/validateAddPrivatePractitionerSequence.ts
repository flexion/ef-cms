import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { sequence } from 'cerebral';
import { setRepresentingFromRepresentingMapActionFactory } from '../../actions/setRepresentingFromRepresentingMapActionFactory';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../../actions/shouldValidateAction';
import { validateAddPrivatePractitionerAction } from '../../actions/CaseAssociation/validateAddPrivatePractitionerAction';

export const validateAddPrivatePractitionerSequence = sequence([
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setRepresentingFromRepresentingMapActionFactory('modal'),
      validateAddPrivatePractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
]);
