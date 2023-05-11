import { state } from 'cerebral';

export const setValidationErrorsAction = ({ props, store }) => {
  console.log('props.errors', props.errors);
  store.set(state.validationErrors, props.errors);
};
