const { get } = require('../requests');

/**
 * getMaintenanceModePublicInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getMaintenanceModePublicInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/maintenance-mode',
  });
};
