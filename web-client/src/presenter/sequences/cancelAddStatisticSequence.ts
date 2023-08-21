import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { sequence } from 'cerebral';

export const cancelAddStatisticSequence = sequence([
  clearConfirmationTextAction,
  navigateToCaseDetailCaseInformationActionFactory('statistics'),
]);
