import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setFileOnFormAction = ({ props, store }: ActionProps) => {
  store.set(state.form[props.fileName], props.file);
  const fileSize = `${props.fileName}Size`;
  store.set(state.form[fileSize], props.file.size);
};
