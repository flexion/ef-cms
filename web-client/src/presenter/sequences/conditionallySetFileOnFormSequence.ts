import { checkForEncryptionAction } from '../actions/checkForEncryptionAction';
import { removeFileOnFormAction } from '@web-client/presenter/actions/removeFileOnFormAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setFileOnFormAction } from '@web-client/presenter/actions/setFileOnFormAction';

export const conditionallySetFileOnFormSequence = [
  checkForEncryptionAction,
  {
    invalid: [setAlertErrorAction, removeFileOnFormAction],
    valid: [setFileOnFormAction],
  },
];
