import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getUserAction } from '../actions/getUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserOnFormAction } from '../actions/setUserOnFormAction';

export const gotoUserContactEditSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  clearScreenMetadataAction,
  getUserAction,
  setUserOnFormAction,
  setCurrentPageAction('UserContactEdit'),
];
