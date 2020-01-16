import { state } from 'cerebral';

/**
 * returns true if an alternate back path exists, false otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.store the cerebral store object
 * @returns {Promise<*>} the path for whether an alternate back location exists
 *
 */

export const getHasAlternateBackLocationAction = ({ get, path }) => {
  const backLocation = get(state.screenMetadata.backLocation);

  if (backLocation) {
    return path.true({ path: backLocation });
  } else {
    return path.false();
  }
};
