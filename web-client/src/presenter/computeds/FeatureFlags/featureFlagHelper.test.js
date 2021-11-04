import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  const mockInternalUser = {
    role: ROLES.petitionsClerk,
  };
  const mockExternalUser = {
    role: ROLES.petitioner,
  };

  describe('isOrderSearchEnabledForRole', () => {
    it('should be true when the user is internal and state.isInternalOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { isInternalOrderSearchEnabled: true, user: mockInternalUser },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is external, state.isInternalOrderSearchEnabled is true, and state.isExternalOrderSearchEnabled is false', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: false,
          isInternalOrderSearchEnabled: true,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: false,
      });
    });

    it('should be true when the user is external, state.isInternalOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: true,
          isInternalOrderSearchEnabled: false,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be true when the user is public, state.isInternalOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: true,
          isInternalOrderSearchEnabled: false,
          user: {},
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is internal, state.isInternalOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is false', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: false,
          isInternalOrderSearchEnabled: false,
          user: mockInternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: false,
      });
    });
  });

  describe('isInternalOpinionSearchEnabled', () => {
    it('should be true when the internal-opinion-search-enabled feature is enabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isInternalOpinionSearchEnabled: true,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isInternalOpinionSearchEnabled: true,
      });
    });

    it('should be false when the advanced_opinion_search feature is NOT enabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isInternalOpinionSearchEnabled: false,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isInternalOpinionSearchEnabled: false,
      });
    });
  });
});
