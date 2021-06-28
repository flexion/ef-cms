import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { startScanSequence } from '../sequences/startScanSequence';
describe('startScanSequence', () => {
  let integrationTest;
  let mockItems;
  const mockSources = ['Test Source 1', 'Test Source 2'];
  beforeAll(() => {
    global.alert = () => null;
    applicationContext
      .getPersistenceGateway()
      .getItem.mockImplementation(({ key }) => mockItems[key]);
    applicationContext
      .getScanner()
      .getSourceNameByIndex.mockReturnValue('Mock Scanner');
    applicationContext.getScanner().getSources.mockReturnValue(mockSources);

    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      startScanSequence,
    };
    integrationTest = CerebralTest(presenter);
  });
  it('gets the cached scan source name and starts the scan action', async () => {
    mockItems = {
      scannerSourceIndex: '1',
      scannerSourceName: 'Mock Scanner',
    };
    integrationTest.setState('scanner.batches', []);
    await integrationTest.runSequence('startScanSequence', {});

    expect(applicationContext.getScanner().startScanSession).toHaveBeenCalled();
    expect(integrationTest.getState('scanner.isScanning')).toBeTruthy();
  });

  it('provides a flow for setting a scan source if one is not cached', async () => {
    mockItems = {
      scannerSourceIndex: null,
      scannerSourceName: '',
    };
    integrationTest.setState('scanner.batches', []);
    await integrationTest.runSequence('startScanSequence', {});
    const scannerState = integrationTest.getState('scanner');

    expect(scannerState.sources.length).toEqual(mockSources.length);
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'SelectScannerSourceModal',
    );
  });
});
