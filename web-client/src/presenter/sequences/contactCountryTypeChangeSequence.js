import { clearAlertsAction } from '../actions/clearAlertsAction';
import { contactCountryTypeChangeAction } from '../actions/contactCountryTypeChangeAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const contactCountryTypeChangeSequence = [
  contactCountryTypeChangeAction,
  stopShowValidationAction,
  setFormValueAction,
  clearAlertsAction,
];
