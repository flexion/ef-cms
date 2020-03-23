import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export const loginWithTokenSequence = [
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  setUserPermissionsAction,
  navigateToDashboardAction,
];
