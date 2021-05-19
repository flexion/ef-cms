import { state } from 'cerebral';

/**
 * Validates the contact form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validateContactAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { contact } = get(state.form);

  // we hard-code this to petitioner because other petitioners
  // should always validate like a primary contact of a petitioner case
  // TODO: refactor to get from constants
  const partyType = 'Petitioner';

  const errors = applicationContext.getUseCases().validateContactInteractor({
    applicationContext,
    contactInfo: contact,
    partyType,
  });

  store.set(state.validationErrors.contact, errors || {});

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
