import { getNotificationsAction } from '../actions/getNotificationsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';

export const refreshUserNotificationsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [getNotificationsAction, setNotificationsAction],
    unauthorized: [],
  },
];
