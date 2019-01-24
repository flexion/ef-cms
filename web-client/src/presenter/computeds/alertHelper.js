import { state } from 'cerebral';

export default get => {
  const alertError = get(state.alertError);

  return {
    showErrorAlert: alertError,
    showSingleMessage: alertError && !!alertError.message,
    showMultipleMessages: alertError && !!alertError.messages,
    showNoMessage: alertError && !alertError.message && !alertError.messages,
  };
};
