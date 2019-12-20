/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId id of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getConsolidatedCasesByCaseInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: caseId,
    });

  const userMappings = await applicationContext
    .getPersistenceGateway()
    .getUserMappingByConsolidatedCases({
      applicationContext,
      consolidatedCases,
    });

  const isRequestingUserAssociatedMap = userMappings.reduce(
    (acc, userMapping) => {
      if (userMapping) {
        acc[userMapping.sk] = true;
      }
      return acc;
    },
    {},
  );

  return consolidatedCases.map(consolidatedCase => ({
    ...consolidatedCase,
    isRequestingUserAssociated: !!isRequestingUserAssociatedMap[
      consolidatedCase.caseId
    ],
  }));
};
