const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateTrialCalendarPdfInteractor,
} = require('./generateTrialCalendarPdfInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateTrialCalendarPdfInteractor', () => {
  const mockPdfUrl = { url: 'www.example.com' };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        MOCK_CASE,
        MOCK_CASE,
        MOCK_CASE,
      ]);

    applicationContext
      .getTemplateGenerators()
      .generateTrialCalendarTemplate.mockReturnValue(true);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      generateTrialCalendarPdfInteractor({
        applicationContext,
        content: {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock.calls
        .length,
    ).toBe(1);
    expect(
      applicationContext.getUtilities().formattedTrialSessionDetails.mock.calls
        .length,
    ).toBe(1);
    expect(
      applicationContext.getUtilities().getFormattedCaseDetail.mock.calls
        .length,
    ).toBe(3);
    expect(
      applicationContext.getTemplateGenerators().generateTrialCalendarTemplate
        .mock.calls.length,
    ).toBe(1);
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls
        .length,
    ).toBe(1);
  });

  it('should return the trial session calendar pdf url', async () => {
    const result = await generateTrialCalendarPdfInteractor({
      applicationContext,
      content: {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    expect(result.url).toBe(mockPdfUrl.url);
  });
});
