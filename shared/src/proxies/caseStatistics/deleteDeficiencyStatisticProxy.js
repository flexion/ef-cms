const { remove } = require('../requests');

/**
 * deleteDeficiencyStatisticInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {string} providers.statisticId the id of the statistic to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteDeficiencyStatisticInteractor = ({
  applicationContext,
  docketNumber,
  statisticId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/statistics/${statisticId}`,
  });
};
