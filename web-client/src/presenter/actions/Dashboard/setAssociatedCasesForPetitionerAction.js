import { state } from 'cerebral';

/**
 * Add the list of consolidated case docket numbers the petitioner has access to if the
 * consolidated-cases-party-association feature flag is on
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setAssociatedCasesForPetitionerAction = ({ props, store }) => {
  const { openCaseList } = props;

  const consolidatedCaseDocketNumbers = openCaseList
    .flatMap(openCase => openCase.consolidatedCases)
    .filter(consolidatedCase => !!consolidatedCase)
    .map(consolidated => consolidated.docketNumber);

  store.set(state.consolidatedCaseDocketNumbers, consolidatedCaseDocketNumbers);
};
