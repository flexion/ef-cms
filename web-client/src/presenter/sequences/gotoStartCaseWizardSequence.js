import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getFilingTypesAction } from '../actions/getFilingTypesAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFilingTypesAction } from '../actions/setFilingTypesAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';

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
    docketclerk: [setCurrentPageAction('StartCaseInternal')],
    petitioner: [
      getFilingTypesAction,
      setFilingTypesAction,
      set(state.wizardStep, props.wizardStep),
      set(state.form.wizardStep, props.step),
      setCurrentPageAction('StartCaseWizard'),
    ],
    petitionsclerk: [setCurrentPageAction('StartCaseInternal')],
    practitioner: [
      getFilingTypesAction,
      setFilingTypesAction,
      set(state.wizardStep, props.wizardStep),
      set(state.form.wizardStep, props.step),
      setCurrentPageAction('StartCaseWizard'),
    ],
  },
];
