import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { sequence } from 'cerebral';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitOtherStatisticsAction } from '../actions/submitOtherStatisticsAction';

export const submitAddOtherStatisticsSequence = sequence(
  showProgressSequenceDecorator([
    clearErrorAlertsAction,
    submitOtherStatisticsAction,
    {
      error: [setAlertErrorAction],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        navigateToCaseDetailCaseInformationActionFactory(),
      ],
    },
  ]),
);
