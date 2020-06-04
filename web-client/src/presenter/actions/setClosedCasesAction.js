import { state } from 'cerebral';

/**
 * sets the state.closedCases based on the props.closedCaseList passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @param {object} providers.props the cerebral props object used for passing the props.caseList
 */
export const setClosedCasesAction = ({ props, store }) => {
  store.set(state.closedCases, props.closedCaseList);
};
