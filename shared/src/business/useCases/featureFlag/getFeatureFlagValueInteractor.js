const { ALLOWLIST_FEATURE_FLAGS } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getFeatureFlagValueInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get the value for
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */
exports.getFeatureFlagValueInteractor = async (
  applicationContext,
  { featureFlag },
) => {
  if (Object.values(ALLOWLIST_FEATURE_FLAGS).includes(featureFlag)) {
    return await applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue({ applicationContext, featureFlag });
  } else {
    throw new UnauthorizedError(
      `Unauthorized: ${featureFlag} is not included in the allowlist`,
    );
  }
};
