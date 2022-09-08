import { state } from 'cerebral';

/**
 * using the addedDocketNumbers state, setup the expected check boxes
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setupConsolidatedCasesForAddedDocketNumbersAction = ({
  get,
  store,
}) => {
  let consolidatedCases = get(state.caseDetail.consolidatedCases);
  let addedDocketNumbers = get(state.addedDocketNumbers) ?? [];

  console.log(addedDocketNumbers);
  if (consolidatedCases) {
    consolidatedCases = consolidatedCases.map(consolidatedCase => {
      return {
        ...consolidatedCase,
        checkboxDisabled: true,
        checked:
          consolidatedCase.docketNumber === consolidatedCase.leadDocketNumber ||
          addedDocketNumbers.includes(consolidatedCase.docketNumberWithSuffix),
        formattedPetitioners: consolidatedCase.petitioners
          .map(ptr => ptr.name)
          .join(' & '),
        tooltip: '',
      };
    });

    console.log('consolidatedCases', consolidatedCases);

    const shouldSelectedAll = consolidatedCases.every(
      consolidatedCase => consolidatedCase.checked,
    );

    consolidatedCases = consolidatedCases.map(consolidatedCase => {
      return {
        ...consolidatedCase,
        checkboxDisabled:
          consolidatedCase.docketNumber === consolidatedCase.leadDocketNumber ||
          shouldSelectedAll,
      };
    });

    store.set(state.consolidatedCaseAllCheckbox, shouldSelectedAll);
    store.set(state.caseDetail.consolidatedCases, consolidatedCases);
  }
};
