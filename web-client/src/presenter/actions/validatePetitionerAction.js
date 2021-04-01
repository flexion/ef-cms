import { state } from 'cerebral';

/**
 * Validates petitioner information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validatePetitionerAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { contact } = get(state.form);
  const { partyType, petitioners } = get(state.caseDetail);

  const errors = applicationContext.getUseCases().validatePetitionerInteractor({
    applicationContext,
    contactInfo: contact,
    partyType,
    petitioners,
  });

  store.set(state.validationErrors.contact, errors || {});

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
