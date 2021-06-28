import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoPrintablePendingReportForCaseSequence } from '../sequences/gotoPrintablePendingReportForCaseSequence';
import { presenter } from '../presenter-mock';

const { CHAMBERS_SECTION } = applicationContext.getConstants();

describe('gotoPrintablePendingReportForCaseSequence', () => {
  let integrationTest;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: CHAMBERS_SECTION,
    });
    applicationContext
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockReturnValue(
        'http://example.com/mock-pdf-url',
      );
    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      docketEntries: [
        {
          docketEntryId: '123',
          documentType: 'Proposed Stipulated Decision',
        },
      ],
    });
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      revokeObjectURL: () => {},
    };
    presenter.sequences = {
      gotoPrintablePendingReportForCaseSequence,
    };
    integrationTest = CerebralTest(presenter);
  });
  it('Should show the Printable Pending Report page', async () => {
    integrationTest.setState('currentPage', 'SomeOtherPage');
    await integrationTest.runSequence(
      'gotoPrintablePendingReportForCaseSequence',
      {
        docketNumber: '101-21',
      },
    );
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
