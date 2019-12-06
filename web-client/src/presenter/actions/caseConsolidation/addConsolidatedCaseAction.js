/**
 * call to consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const addConsolidatedCaseAction = async ({
  applicationContext,
  props,
}) => {
  const { caseDetail, caseToConsolidate } = props;

  const leadCaseId = caseDetail.caseId;
  const caseToConsolidateId = caseToConsolidate.caseId;

  await applicationContext.getUseCases().addConsolidatedCaseInteractor({
    applicationContext,
    caseId: caseToConsolidateId,
    leadCaseId,
  });

  return {
    caseId: leadCaseId,
    caseToConsolidateId,
  };
};
