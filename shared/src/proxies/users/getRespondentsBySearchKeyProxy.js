const { get } = require('../requests');

/**
 * getRespondentsBySearchKeyProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.searchKey the search string entered by the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getRespondentsBySearchKeyInteractor = ({
  applicationContext,
  searchKey,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/respondents/search?searchKey=${searchKey}`,
  });
};
