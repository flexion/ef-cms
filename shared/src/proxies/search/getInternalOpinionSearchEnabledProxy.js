const { get } = require('../requests');

/**
 * getInternalOpinionSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getInternalOpinionSearchEnabledInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/search/internal-opinion-search-enabled',
  });
};
