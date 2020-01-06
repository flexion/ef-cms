import { state } from 'cerebral';

/**
 * sets the state.trialSession.eligibleCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.eligibleCases
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 */
export const setQcCompleteOnCaseOnTrialSessionAction = ({
  get,
  props,
  store,
}) => {
  const { updatedCase } = props;

  const eligibleCases = get(state.trialSession.eligibleCases);

  const eligibleCase = eligibleCases.find(
    myCase => myCase.caseId === updatedCase.caseId,
  );

  eligibleCase.qcCompleteForTrial = updatedCase.qcCompleteForTrial;

  store.set(state.trialSession.eligibleCases, eligibleCases);
};
