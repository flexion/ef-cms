import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const emailConfirmationFormHelper = (get: Get): any => {
  const {
    confirmEmailErrorMessage,
    emailErrorMessage,
    inFocusConfirmEmail,
    inFocusEmail,
    isDirtyConfirmEmail,
    isDirtyEmail,
  } = get(state.emailConfirmation);

  return {
    confirmEmailErrorMessage,
    emailErrorMessage,
    showConfirmEmailErrorMessage: isDirtyConfirmEmail && !inFocusConfirmEmail,
    showEmailErrorMessage: isDirtyEmail && !inFocusEmail,
  };
};
