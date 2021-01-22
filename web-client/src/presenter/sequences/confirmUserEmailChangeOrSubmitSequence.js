import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { shouldOpenConfirmEmailModalAction } from '../actions/shouldOpenConfirmEmailModalAction';
import { submitUpdateUserContactInformationSequence } from './submitUpdateUserContactInformationSequence';

export const confirmUserEmailChangeOrSubmitSequence = [
  shouldOpenConfirmEmailModalAction,
  {
    no: [submitUpdateUserContactInformationSequence],
    yes: [setShowModalFactoryAction('ConfirmEmailModal')],
  },
];
