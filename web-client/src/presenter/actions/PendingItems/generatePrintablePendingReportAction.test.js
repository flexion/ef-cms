import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintablePendingReportAction } from './generatePrintablePendingReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generatePrintablePendingReportAction', () => {
  let resultUrl;

  beforeAll(() => {
    resultUrl = 'https://example.com';
    presenter.providers.applicationContext = applicationContextForClient;

    applicationContextForClient
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockImplementation(
        () => resultUrl,
      );
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { caseIdFilter: '123acb' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { judgeFilter: 'Judge Armen' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });
});
