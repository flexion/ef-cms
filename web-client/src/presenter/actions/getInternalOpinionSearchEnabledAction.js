import { state } from 'cerebral';

/**
 * Determines if internal opinion search is enabled
 *
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object
 * @param {object} providers.store the cerebral store object
 * @returns {object} next path in sequence based on if opinion search is enabled or not
 */
export const getInternalOpinionSearchEnabledAction = async ({
  applicationContext,
  path,
  store,
}) => {
  const internalOpinionSearchEnabled = await applicationContext
    .getUseCases()
    .getInternalOpinionSearchEnabledInteractor(applicationContext);

  store.set(state.isInternalOpinionSearchEnabled, internalOpinionSearchEnabled);

  if (internalOpinionSearchEnabled) {
    return path.yes();
  }

  return path.no({
    alertWarning: {
      message:
        "Opinion search has been disabled. You'll be notified when it's back up.",
    },
  });
};
