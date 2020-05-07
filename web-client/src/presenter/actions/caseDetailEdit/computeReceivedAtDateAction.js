import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {object} props object
 */
export const computeReceivedAtDateAction = ({ get, store }) => {
  let formDate = null;
  const formMonth = get(state.form.receivedAtMonth);
  const formDay = get(state.form.receivedAtDay);
  const formYear = get(state.form.receivedAtYear);

  if (formMonth || formDay || formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => segment.padStart(2, '0'))
      .join('-');
  }

  store.set(state.form.receivedAt, formDate);

  return { computedReceivedAt: formDate };
};
