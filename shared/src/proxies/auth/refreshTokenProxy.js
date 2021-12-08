const { post } = require('../requests');

/**
 * refreshTokenInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.refreshTokenInteractor = applicationContext => {
  return post({
    applicationContext,
    endpoint: process.env.IS_LOCAL ? '/auth/refresh' : '/auth/auth/refresh',
    options: {
      withCredentials: true,
    },
  });
};
