import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startScanAction } from './startScanAction';

const mockStartScanSession = jest.fn();

presenter.providers.applicationContext = {
  getScanner: () => ({
    startScanSession: mockStartScanSession,
  }),
};

describe('startScanAction', () => {
  it('tells the TWAIN library to begin image aquisition', async () => {
    const result = await runAction(startScanAction, {
      modules: {
        presenter,
      },
      state: {
        isScanning: false,
      },
    });

    expect(result.state.isScanning).toBeTruthy();
    expect(mockStartScanSession).toHaveBeenCalled();
  });
});
