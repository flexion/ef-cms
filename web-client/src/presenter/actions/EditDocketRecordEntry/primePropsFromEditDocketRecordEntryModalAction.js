import { state } from 'cerebral';

/**
 * update props from modal state to pass to through sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromEditDocketRecordEntryModalAction = ({ get }) => {
  const docketRecordEntry = get(state.modal.form);

  return { docketRecordEntry };
};
