import { set, toggle, parallel } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [
  actions.clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  actions.clearPetitionForm,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogInForm = [
  actions.setFormSubmitting,
  actions.getUser,
  {
    error: [actions.setAlertError],
    success: [actions.setUser, actions.navigateHome],
  },
  actions.unsetFormSubmitting,
];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
];

export const submitFilePetitionForm = [
  set(state`petition.uploadsFinished`, 0),
  actions.setFormSubmitting,
  actions.getDocumentPolicy,
  {
    error: [actions.setAlertError, actions.unsetFormSubmitting],
    success: [
      parallel([
        actions.getDocumentIdFactory('petitionFile'),
        actions.getDocumentIdFactory('requestForPlaceOfTrial'),
        actions.getDocumentIdFactory('statementOfTaxpayerIdentificationNumber'),
      ]),
      actions.handleDocumentIdBatch,
      {
        error: [actions.setAlertError, actions.unsetFormSubmitting],
        success: [
          actions.setDocumentIdFactory('petitionFile'),
          actions.setDocumentIdFactory('requestForPlaceOfTrial'),
          actions.setDocumentIdFactory(
            'statementOfTaxpayerIdentificationNumber',
          ),
          actions.uploadDocumentToS3Factory('petitionFile'),
          {
            error: [actions.setAlertError, actions.unsetFormSubmitting],
            success: [
              set(state`petition.uploadsFinished`, 1),
              actions.uploadDocumentToS3Factory('requestForPlaceOfTrial'),
              {
                error: [actions.setAlertError, actions.unsetFormSubmitting],
                success: [
                  set(state`petition.uploadsFinished`, 2),
                  actions.uploadDocumentToS3Factory(
                    'statementOfTaxpayerIdentificationNumber',
                  ),
                  {
                    error: [actions.setAlertError, actions.unsetFormSubmitting],
                    success: [
                      set(state`petition.uploadsFinished`, 3),
                      actions.unsetFormSubmitting,
                      actions.getPetitionUploadAlertSuccess,
                      actions.setAlertSuccess,
                      actions.navigateHome,
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
