import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoPrintablePendingReportSequence } from '../sequences/gotoPrintablePendingReportSequence';
import { presenter } from '../presenter-mock';

describe('gotoPrintablePendingReportSequence', () => {
  let integrationTest;
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      revokeObjectURL: () => {},
    };
    presenter.sequences = {
      gotoPrintablePendingReportSequence,
    };
    integrationTest = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    integrationTest.setState('currentPage', 'SomeOtherPage');
    await integrationTest.runSequence('gotoPrintablePendingReportSequence', {});
    expect(integrationTest.getState('currentPage')).toBe(
      'SimplePdfPreviewPage',
    );
    expect(integrationTest.getState('pdfPreviewUrl')).toBe(
      'http://example.com/mock-pdf-url',
    );
    expect(integrationTest.getState('screenMetadata.headerTitle')).toBe(
      'Pending Report',
    );
  });
});
