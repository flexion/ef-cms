import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getBlockedCasesByTrialLocationSequence =
  showProgressSequenceDecorator([
    setFormValueAction,
    getBlockedCasesByTrialLocationAction,
    setBlockedCasesAction,
  ]);
