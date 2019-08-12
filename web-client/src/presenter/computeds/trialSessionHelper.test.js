import { runCompute } from 'cerebral/test';
import { trialSessionHelper } from './trialSessionHelper';

describe('trial session helper computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionHelper, {});
    expect(result).toBeDefined();
  });
});
