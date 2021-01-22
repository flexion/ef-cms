import { state } from 'cerebral';

/**
 * validate the case or session note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const shouldOpenConfirmEmailModalAction = ({ get, path }) => {
  const { email, originalEmail } = get(state.form);

  if (originalEmail.toLowerCase() === email.toLowerCase()) {
    return path.no();
  } else {
    return path.yes();
  }
};
