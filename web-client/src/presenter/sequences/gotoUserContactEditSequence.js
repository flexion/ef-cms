import { getUserAction } from '../actions/getUserAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserAction } from '../actions/setUserAction';
import { state } from 'cerebral';

export const gotoUserContactEditSequence = [
  setCurrentPageAction('Interstitial'),
  set(state.forceLoadUser, true),
  getUserAction,
  setUserAction,
  setCurrentPageAction('UserContactEdit'),
];
