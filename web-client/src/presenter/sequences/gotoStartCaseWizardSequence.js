import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getFilingTypesAction } from '../actions/getFilingTypesAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { set } from 'cerebral/factories';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFilingTypesAction } from '../actions/setFilingTypesAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { state } from 'cerebral';

export const gotoStartCaseWizardSequence = [
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  prepareFormAction,
  set(state.showValidation, false),
  getCaseTypesAction,
  setCaseTypesAction,
  getProcedureTypesAction,
  setProcedureTypesAction,
  getUserRoleAction,
  {
    docketclerk: [
      set(state.documentSelectedForScan, 'petitionFile'),
      setCurrentPageAction('StartCaseInternal'),
    ],
    petitioner: [
      getFilingTypesAction,
      setFilingTypesAction,
      set(state.wizardStep, 'StartCaseStep1'),
      set(state.form.wizardStep, '1'),
      setCurrentPageAction('StartCaseWizard'),
    ],
    petitionsclerk: [
      set(state.documentSelectedForScan, 'petitionFile'),
      setCurrentPageAction('StartCaseInternal'),
    ],
    practitioner: [
      getFilingTypesAction,
      setFilingTypesAction,
      set(state.wizardStep, 'StartCaseStep1'),
      set(state.form.wizardStep, '1'),
      setCurrentPageAction('StartCaseWizard'),
    ],
  },
];
