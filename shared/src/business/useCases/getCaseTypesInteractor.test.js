const { getCaseTypes } = require('./getCaseTypesInteractor');

describe('Get case types', () => {
  beforeEach(() => {});

  it('returns a collection of case types', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
    };
    const caseTypes = await getCaseTypes({
      applicationContext,
    });
    expect(caseTypes.length).toBeGreaterThan(0);
    expect(caseTypes[0]).not.toBeUndefined();
    expect(typeof caseTypes[0]).toEqual('string');
  });
});
