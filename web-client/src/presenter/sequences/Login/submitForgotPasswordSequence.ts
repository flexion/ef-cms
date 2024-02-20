import { forgotPasswordAction } from '@web-client/presenter/actions/Login/forgotPasswordAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertWarningAction } from '@web-client/presenter/actions/setAlertWarningAction';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const submitForgotPasswordSequence = [
  showProgressSequenceDecorator([
    forgotPasswordAction,
    {
      success: [setupCurrentPageAction('ChangePassword')],
      unconfirmedAccount: [
        setAlertWarningAction,
        setSaveAlertsForNavigationAction,
        navigateToLoginAction,
      ],
    },
  ]),
] as unknown as () => {};
