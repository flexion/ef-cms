import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const { role } = get(state.user);

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);
  const isInternalOrderSearchEnabled = get(state.isInternalOrderSearchEnabled);
  const isInternalOpinionSearchEnabled = get(
    state.isInternalOpinionSearchEnabled,
  );

  let isOrderSearchEnabledForRole = false;
  if (role && isUserInternal) {
    isOrderSearchEnabledForRole = isInternalOrderSearchEnabled;
  } else {
    isOrderSearchEnabledForRole = get(state.isExternalOrderSearchEnabled);
  }

  return {
    isInternalOpinionSearchEnabled,
    isInternalOrderSearchEnabled,
    isOrderSearchEnabledForRole,
  };
};
