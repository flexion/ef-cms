const { get } = require('../requests');

/**
 * getPractitionersBySearchKeyProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.searchKey the search string entered by the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPractitionersBySearchKeyInteractor = ({
  applicationContext,
  searchKey,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/practitioners/search?searchKey=${searchKey}`,
  });
};
