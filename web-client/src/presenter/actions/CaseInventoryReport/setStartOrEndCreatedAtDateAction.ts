import { CaseStatus } from '../../../../../shared/src/business/entities/EntityConstants';
import { GetCaseInventoryReportRequest } from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for passing props.date
 * @param {object} providers.store the cerebral store used for setting the state.customCaseInventoryFilters.createStartDate or state.customCaseInventoryFilters.createEndDate
 */
export const setStartOrEndCreatedAtDateAction = ({
  applicationContext,
  get,
  props,
  store,
}: {
  applicationContext: any;
  get: any;
  props: Partial<GetCaseInventoryReportRequest> & {
    caseStatuses: { action: 'add' | 'remove'; caseStatus: CaseStatus };
  };
  store: any;
}) => {
  const currentFilters: GetCaseInventoryReportRequest = get(
    state.customCaseInventoryFilters,
  );
  const desiredFilters = cloneDeep(props);
  if (props.createStartDate) {
    const dateWithTime = applicationContext
      .getUtilities()
      .createISODateString(props.createStartDate, 'MM/dd/yyyy'); // TODO: USE FORMATS CONSTANT FROM DATEHANDLER
    desiredFilters.createStartDate = dateWithTime;
    store.merge(state.customCaseInventoryFilters, desiredFilters);
  }
  if (props.createEndDate) {
    const dateWithTime = applicationContext
      .getUtilities()
      .createISODateString(props.createEndDate, 'MM/dd/yyyy'); // TODO: USE FORMATS CONSTANT FROM DATEHANDLER
    desiredFilters.createEndDate = dateWithTime;
    store.merge(state.customCaseInventoryFilters, desiredFilters);
  }
  if (props.filingMethod) {
    store.merge(state.customCaseInventoryFilters, desiredFilters);
  }
  if (props.caseStatuses) {
    if (props.caseStatuses.action === 'add') {
      currentFilters.caseStatuses.push(props.caseStatuses.caseStatus);
      store.merge(state.customCaseInventoryFilters, currentFilters);
    } else if (props.caseStatuses.action === 'remove') {
      const foundIndex = currentFilters.caseStatuses.findIndex(
        caseStatus => caseStatus === props.caseStatuses.caseStatus,
      );
      currentFilters.caseStatuses.splice(foundIndex, 1);
      store.merge(state.customCaseInventoryFilters, currentFilters);
    }
  }
};

// if (props contains date) transform createISODateString
// if (props contains array-able filters) transform to an array
// store.merge(state stuff)
