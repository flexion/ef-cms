import { clearFormAction } from '../actions/clearFormAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { getPractitionerDocumentAction } from '../actions/getPractitionerDocumentAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerDocumentFormForEditAction } from '../actions/Practitioners/setPractitionerDocumentFormForEditAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoPractitionerEditDocument = [
  setupCurrentPageAction('Interstitial'),
  clearFormAction,
  stopShowValidationAction,
  getPractitionerDetailAction,
  setPractitionerDetailAction,
  getPractitionerDocumentAction,
  setPractitionerDocumentFormForEditAction,
  setupCurrentPageAction('PractitionerAddEditDocument'),
];

export const gotoPractitionerEditDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(
      gotoPractitionerEditDocument,
    ),
    unauthorized: [navigateToLoginSequence],
  },
];
