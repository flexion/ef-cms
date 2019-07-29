import { presenter } from '../presenter';
import { rescanBatchAction } from './rescanBatchAction';
import { runAction } from 'cerebral/test';

const mockStartScanSession = jest.fn(() => ({
  scannedBuffer: [{ e: 5 }, { f: 6 }],
}));
const mockRemoveItemInteractor = jest.fn();

presenter.providers.applicationContext = {
  getScanner: () => ({
    getSourceNameByIndex: () => 'scanner',
    setSourceByIndex: () => null,
    startScanSession: mockStartScanSession,
  }),
  getUseCases: () => ({
    removeItemInteractor: mockRemoveItemInteractor,
  }),
};
global.alert = () => null;

describe('rescanBatchAction', () => {
  it('rescans the batch based on the props.batchIndex passed in', async () => {
    const result = await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      props: {
        batchIndex: 1,
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        batches: [
          { index: 0, pages: [{ a: 1 }, { b: 2 }] },
          { index: 1, pages: [{ c: 3 }, { d: 4 }] },
        ],
        isScanning: false,
      },
    });

    expect(result.state.isScanning).toBeTruthy();
    expect(mockStartScanSession).toHaveBeenCalled();
    expect(result.state.batches[1].pages).toEqual([{ e: 5 }, { f: 6 }]);
  });

  it('tells the TWAIN library to begin image aquisition with no scanning device set', async () => {
    await runAction(rescanBatchAction, {
      modules: {
        presenter,
      },
      state: {
        isScanning: false,
      },
    });

    expect(mockRemoveItemInteractor).toHaveBeenCalled();
  });
});
