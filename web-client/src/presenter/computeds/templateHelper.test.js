import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { templateHelper as templateHelperComputed } from './templateHelper';
import { withAppContextDecorator } from '../../withAppContext';

const templateHelper = withAppContextDecorator(
  templateHelperComputed,
  applicationContext,
);

describe('templateHelper', () => {
  it('returns showBetaBar false if the current stage is prod', () => {
    applicationContext.getEnvironment.mockReturnValue({
      stage: 'prod',
    });
    const result = runCompute(templateHelper, {});
    expect(result.showBetaBar).toBeFalsy();
  });

  it('returns showBetaBar true if the current stage is not prod', () => {
    applicationContext.getEnvironment.mockReturnValue({
      stage: 'local',
    });
    const result = runCompute(templateHelper, {});
    expect(result.showBetaBar).toBeTruthy();
  });

  it('returns showDeployedDate false if the current stage is prod', () => {
    applicationContext.getEnvironment.mockReturnValue({
      stage: 'prod',
    });
    const result = runCompute(templateHelper, {});
    expect(result.showDeployedDate).toBeFalsy();
  });

  it('returns showDeployedDate true if the current stage is not prod', () => {
    applicationContext.getEnvironment.mockReturnValue({
      stage: 'local',
    });
    const result = runCompute(templateHelper, {});
    expect(result.showDeployedDate).toBeTruthy();
  });
});
