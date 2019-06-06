import { state } from 'cerebral';

const computeTerm = ({ form }) => {
  const selectedMonth = +form.month;
  let term;

  if (selectedMonth) {
    const termsByMonth = {
      fall: [9, 10, 11, 12],
      spring: [4, 5, 6],
      winter: [1, 2, 3],
    };

    if (termsByMonth.winter.includes(selectedMonth)) {
      term = 'Winter';
    } else if (termsByMonth.spring.includes(selectedMonth)) {
      term = 'Spring';
    } else if (termsByMonth.fall.includes(selectedMonth)) {
      term = 'Fall';
    }
  }

  const termYear = form.year;
  return { term, termYear };
};

const computeStartTime = ({ form }) => {
  if (!form.startTimeInput) return undefined;

  let [hours, minutes] = form.startTimeInput.split(':');
  if (form.startTimeExtension == 'pm') {
    hours = `${+hours + 12}`;
  } else {
    hours = hours.padStart(2, '0');
  }
  minutes = (minutes && minutes.padStart(2, '0')) || '00';

  let computedTime = `${hours}:${minutes}`;
  return computedTime;
};

/**
 * computes the trial session form data based on user input
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store function
 */
export const computeTrialSessionFormDataAction = ({ get, store }) => {
  const form = get(state.form);

  const { term, termYear } = computeTerm({ form });
  if (term) store.set(state.form.term, term);
  if (termYear) store.set(state.form.termYear, termYear);

  const startTime = computeStartTime({ form });
  if (startTime) store.set(state.form.startTime, startTime);
};
