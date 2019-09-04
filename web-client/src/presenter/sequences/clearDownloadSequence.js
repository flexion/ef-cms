import { state } from 'cerebral';
import { unset } from 'cerebral/factories';

export const clearDownloadSequence = [unset(state.download)];
