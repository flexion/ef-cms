import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFormSubmittingSequence } from './setFormSubmittingSequence';
import { state } from 'cerebral';
import { unsetFormSubmittingSequence } from './unsetFormSubmittingSequence';

export const gotoOrdersNeededSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  clearScreenMetadataAction,
  setFormSubmittingSequence,
  getCaseAction,
  setCaseAction,
  set(state.currentPage, 'OrdersNeededSummary'),
  unsetFormSubmittingSequence,
];
