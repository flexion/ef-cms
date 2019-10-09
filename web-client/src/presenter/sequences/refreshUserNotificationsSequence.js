import { getNotificationsAction } from '../actions/getNotificationsAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';

export const refreshUserNotificationsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      isInternalUserAction,
      {
        no: [],
        yes: [getNotificationsAction, setNotificationsAction],
      },
    ],
    unauthorized: [],
  },
];
