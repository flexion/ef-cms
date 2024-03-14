import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '@web-client/presenter/actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitUpdatePetitionerAccountVerificationStatusSequence = [
  showProgressSequenceDecorator([
    clearModalAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    setupCurrentPageAction('Interstitial'),
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ]),
];
