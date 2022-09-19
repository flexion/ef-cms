const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatConsolidatedCaseCoversheetData,
} = require('./formatConsolidatedCaseCoversheetData');
import { MOCK_CASE } from '../../../test/mockCase';

describe('formatConsolidatedCaseCoversheetData', () => {
  const mockDocketEntry = MOCK_CASE.docketEntries[0];
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue({
        isFeatureFlagEnabled: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          docketEntries: [],
          docketNumber: '102-19',
        },
        {
          docketEntries: [
            {
              docketEntryId: mockDocketEntry.docketEntryId,
              index: 3,
            },
          ],
          docketNumber: '101-30',
        },

        {
          docketEntries: [
            {
              docketEntryId: mockDocketEntry.docketEntryId,
              index: 4,
            },
          ],
          docketNumber: '101-19',
        },
      ]);
  });

  it('should add docket numbers of all cases in the consolidated group to the coversheet data', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases.length).toEqual(2);
  });

  it('should sort the docket numbers of all cases in the consolidated group by docketNumber, ascending', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases[0]).toMatchObject({
      docketNumber: '101-19',
      documentNumber: 4,
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      docketNumber: '101-30',
      documentNumber: 3,
    });
  });

  it('should include the index of the docket entry for each case in the consolidated group that the document was filed on', async () => {
    const result = await formatConsolidatedCaseCoversheetData({
      applicationContext,
      caseEntity: MOCK_CASE,
      coverSheetData: {},
      docketEntryEntity: mockDocketEntry,
    });

    expect(result.consolidatedCases[0]).toMatchObject({
      documentNumber: 4,
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      documentNumber: 3,
    });
  });
});
