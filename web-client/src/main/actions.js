import { state } from 'cerebral';

export const getUser = async ({ useCases, applicationContext, get, path }) => {
  const user = await useCases.getUser(
    applicationContext.getPersistenceGateway(),
    get(state.form.name),
  );
  if (user) return path.success({ user });
  return path.error({
    alertError: {
      title: 'User not found',
      message: 'Username or password are incorrect',
    },
  });
};

export const getCaseDetail = async ({ store }) => {
  // TODO: retrieve case detail using state.docketNumber
  const caseDetail = state.cases[0];
  store.set(state.caseDetail, caseDetail);
  return;
};
export const setUser = async ({ store, props }) => {
  store.set(state.user, props.user);
  return;
};

export const filePdfPetition = async ({
  useCases,
  applicationContext,
  get,
  store,
}) => {
  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };
  await useCases.filePdfPetition(
    applicationContext.getBaseUrl(),
    applicationContext.getPersistenceGateway(),
    get(state.petition),
    get(state.user),
    fileHasUploaded,
  );
};

export const getFilePdfPetitionAlertSuccess = () => {
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

export const clearPetition = ({ store }) => {
  store.set(state.petition, {
    petitionFile: '',
    requestForPlaceOfTrial: '',
    statementOfTaxpayerIdentificationNumber: '',
    uploadsFinished: 0,
  });
};

export const navigateToDashboard = ({ router }) => {
  router.route('/');
};
