import { state } from 'cerebral';

export const pushValidationErrorsAction = ({ get, props, store }) => {
  const validationErrors = { ...get(state.validationErrors), ...props.errors };
  store.set(state.validationErrors, validationErrors);
};
