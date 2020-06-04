const { Case } = require('../entities/cases/Case');

/**
 * getClosedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the closed cases data
 */
exports.getClosedCasesInteractor = async ({ applicationContext }) => {
  let closedCases;
  let foundCases = [];

  const { userId } = await applicationContext.getCurrentUser();

  closedCases = await applicationContext
    .getPersistenceGateway()
    .getClosedCasesByUser({ applicationContext, userId });

  foundCases = Case.validateRawCollection(closedCases, {
    applicationContext,
  });

  return foundCases;
};
