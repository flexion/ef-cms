import { state } from 'cerebral';

export const getUser = async ({ api, path, get }) => {
  try {
    const user = api.getUser(get(state.form.name));
    return path.success({ user });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'User not found',
        message: 'Username or password are incorrect',
      },
    });
  }
};

export const setUser = ({ store, props }) => {
  store.set(state.user, props.user);
  return;
};

export const getDocumentPolicy = async ({ api, environment, store, path }) => {
  try {
    const response = await api.getDocumentPolicy(environment.getBaseUrl());
    store.set(state.petition.policy, response);
    return path.success();
  } catch (error) {
    return path.error({
      alertError: {
        title: 'There was a problem',
        message: 'Document policy retrieval failed',
      },
    });
  }
};

export const getDocumentIdFactory = documentType => {
  return async ({ api, environment, get }) => {
    try {
      const response = await api.getDocumentId(
        environment.getBaseUrl(),
        get(state.user),
        documentType,
      );
      const result = {};
      result[`${documentType}DocumentId`] = response.documentId;
      return result;
    } catch (error) {
      return {
        alertError: {
          title: 'There was a problem',
          message: 'Fetching document ID failed',
        },
      };
    }
  };
};

export const handleDocumentIdBatch = ({ props, path }) => {
  if (props.alertError) return path.error();
  return path.success();
};

export const setDocumentIdFactory = documentType => {
  return ({ store, props }) => {
    store.set(
      state.petition[documentType].documentId,
      props[`${documentType}DocumentId`],
    );
    return;
  };
};

export const uploadDocumentToS3Factory = documentType => {
  return async ({ api, get, path }) => {
    try {
      await api.uploadDocumentToS3(
        get(state.petition.policy),
        get(state.petition[documentType].documentId),
        get(state.petition[documentType].file),
      );
      return path.success();
    } catch (error) {
      return path.error({
        alertError: {
          title: 'There was a problem',
          message: 'Uploading document failed',
        },
      });
    }
  };
};

export const getPetitionUploadAlertSuccess = () => {
  return {
    alertSuccess: {
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    },
  };
};

export const setFormSubmitting = ({ store }) => {
  store.set(state.submitting, true);
};

export const unsetFormSubmitting = ({ store }) => {
  store.set(state.submitting, false);
};

export const setAlertError = ({ props, store }) => {
  store.set(state.alertError, props.alertError);
};

export const setAlertSuccess = ({ props, store }) => {
  store.set(state.alertSuccess, props.alertSuccess);
};

export const clearLoginForm = ({ store }) => {
  store.set(state.form, {
    name: '',
  });
};

export const clearPetitionForm = ({ store }) => {
  store.set(state.petition, {
    petitionFile: {
      file: undefined,
      documentId: undefined,
    },
    requestForPlaceOfTrial: {
      file: undefined,
      documentId: undefined,
    },
    statementOfTaxpayerIdentificationNumber: {
      file: undefined,
      documentId: undefined,
    },
    uploadsFinished: 0,
  });
};

export const navigateHome = ({ router }) => {
  router.route('/');
};

// export const clearAlertError = ({ store }) => {
//   store.set(state.alertError, {});
// };

// export const clearAlertSuccess = ({ store }) => {
//   store.set(state.alertSuccess, {});
// };
