const { Case } = require('../../../business/entities/cases/Case');
const { getCasesByUser } = require('./getCasesByUser');

/**
 * getOpenCasesByUserId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id to get open cases by
 * @returns {object} the open cases
 */
exports.getOpenCasesByUser = async ({ applicationContext, userId }) => {
  const userCases = await getCasesByUser({ applicationContext, userId });

  const openCases = userCases.filter(
    x => x.status !== Case.STATUS_TYPES.closed,
  );

  return openCases;
};
