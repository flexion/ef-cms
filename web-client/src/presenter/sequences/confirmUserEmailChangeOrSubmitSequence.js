import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { shouldOpenVerifyEmailChangeModalAction } from '../actions/shouldOpenVerifyEmailChangeModalAction';
import { submitUpdateUserContactInformationSequence } from './submitUpdateUserContactInformationSequence';

export const confirmUserEmailChangeOrSubmitSequence = [
  shouldOpenVerifyEmailChangeModalAction,
  {
    no: [submitUpdateUserContactInformationSequence],
    yes: [setShowModalFactoryAction('VerifyEmailChangeModal')],
  },
];
