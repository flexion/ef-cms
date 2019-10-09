import { state } from 'cerebral';

/**
 * invokes the path depending on if the user is an internal user
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the list of section work items
 */
export const isInternalUserAction = ({ get, path }) => {
  const user = get(state.user);
  const internalRoles = [
    'docketclerk',
    'judge',
    'petitionsclerk',
    'seniorattorney',
  ];
  if (internalRoles.includes(user.role)) {
    return path['yes']();
  } else {
    return path['no']();
  }
};
