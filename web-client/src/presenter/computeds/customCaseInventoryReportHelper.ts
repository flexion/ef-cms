import {
  CASE_STATUSES,
  CASE_TYPES,
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { CustomCaseInventoryReportFilters } from '../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { addConsolidatedProperties } from './utilities/addConsolidatedProperties';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = (get, applicationContext) => {
  const caseStatuses = CASE_STATUSES.map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const cases = get(state.customCaseInventory.cases);

  const reportData = cases.map(entry => {
    entry = addConsolidatedProperties({
      applicationContext,
      caseObject: entry,
    });

    entry.caseTitle = Case.getCaseTitle(entry.caseCaption);
    entry.receivedAt = formatDate(entry.receivedAt);

    return entry;
  });

  const populatedFilters: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
  );

  const clearFiltersIsDisabled = ![
    ...populatedFilters.caseStatuses,
    ...populatedFilters.caseTypes,
  ].length;

  const judges = get(state.judges).map(judge => ({
    label: judge.name,
    value: judge.name,
  }));

  const totalCases = get(state.customCaseInventory.totalCases);
  const pageCount = Math.ceil(totalCases / CUSTOM_CASE_INVENTORY_PAGE_SIZE);

  const runReportButtonIsDisabled = !(
    populatedFilters.startDate && populatedFilters.endDate
  );

  const formatDate = isoDateString =>
    applicationContext
      .getUtilities()
      .formatDateString(isoDateString, FORMATS.MMDDYY);

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  return {
    caseStatuses,
    caseTypes,
    cases: reportData,
    clearFiltersIsDisabled,
    judges,
    pageCount,
    runReportButtonIsDisabled,
    today,
  };
};
