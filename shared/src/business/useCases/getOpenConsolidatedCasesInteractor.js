const { Case } = require('../entities/cases/Case');
const { UserCase } = require('../entities/UserCase');

const garbage = ({ openUserCases }) => {
  let caseMapping = {};
  let userCaseIdsMap = {};
  let leadCaseIdsToGet = [];

  openUserCases.forEach(caseRecord => {
    const { caseId, leadCaseId } = caseRecord;

    caseRecord.isRequestingUserAssociated = true;
    userCaseIdsMap[caseId] = true;

    if (!leadCaseId || leadCaseId === caseId) {
      caseMapping[caseId] = caseRecord;
    }

    if (leadCaseId && !leadCaseIdsToGet.includes(leadCaseId)) {
      leadCaseIdsToGet.push(leadCaseId);
    }
  });

  return { caseMapping, leadCaseIdsToGet, userCaseIdsMap };
};

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenConsolidatedCasesInteractor = async ({ applicationContext }) => {
  let foundCases = [];

  const { userId } = await applicationContext.getCurrentUser();

  const openUserCases = await applicationContext
    .getPersistenceGateway()
    .getOpenCasesByUser({ applicationContext, userId });

  const openUserCasesValidated = UserCase.validateRawCollection(openUserCases, {
    applicationContext,
  });

  if (openUserCasesValidated.length) {
    const { caseMapping, leadCaseIdsToGet, userCaseIdsMap } = garbage({
      openUserCasesValidated,
    });

    for (const leadCaseId of leadCaseIdsToGet) {
      const consolidatedCases = await applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId({
          applicationContext,
          leadCaseId,
        });

      const consolidatedCasesValidated = Case.validateRawCollection(
        consolidatedCases,
        { applicationContext, filtered: true },
      );

      if (!caseMapping[leadCaseId]) {
        const leadCase = consolidatedCasesValidated.find(
          consolidatedCase => consolidatedCase.caseId === leadCaseId,
        );
        leadCase.isRequestingUserAssociated = false;
        caseMapping[leadCaseId] = leadCase;
      }

      const caseConsolidatedCases = [];
      consolidatedCasesValidated.forEach(consolidatedCase => {
        consolidatedCase.isRequestingUserAssociated = !!userCaseIdsMap[
          consolidatedCase.caseId
        ];
        if (consolidatedCase.caseId !== leadCaseId) {
          caseConsolidatedCases.push(consolidatedCase);
        }
      });

      caseMapping[leadCaseId].consolidatedCases = Case.sortByDocketNumber(
        caseConsolidatedCases,
      );
    }

    foundCases = Object.keys(caseMapping).map(caseId => caseMapping[caseId]);
  }

  return foundCases;
};
