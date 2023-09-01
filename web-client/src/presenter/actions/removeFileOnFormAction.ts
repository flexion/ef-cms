import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const removeFileOnFormAction = ({ props, store }: ActionProps) => {
  store.unset(state.form[props.fileName]);
  const fileSize = `${props.fileName}Size`;
  store.unset(state.form[fileSize]);
  window.document.getElementById(props.inputId).value = null;
};
