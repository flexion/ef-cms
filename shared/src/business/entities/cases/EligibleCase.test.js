const { EligibleCase } = require('./EligibleCase');
const { MOCK_CASE_WITH_SECONDARY_OTHERS } = require('../../../test/mockCase');
const { MOCK_COMPLEX_CASE } = require('../../../test/mockComplexCase');

describe('EligibleCase', () => {
  it('white lists the fields set within the entity, removing those not defined', () => {
    const eligibleCase = new EligibleCase(MOCK_CASE_WITH_SECONDARY_OTHERS);

    expect(eligibleCase.getFormattedValidationErrors()).toBe(null);
    expect(eligibleCase.docketEntries).toBeUndefined();
    expect(eligibleCase.otherPetitioners).toBeUndefined();
    expect(eligibleCase.irsPractitioners).toBeDefined();
  });

  it('retains irsPractitioners and privatePractitioners', () => {
    const eligibleCase = new EligibleCase(MOCK_COMPLEX_CASE);

    expect(eligibleCase.irsPractitioners).toBeDefined();
    expect(eligibleCase.privatePractitioners).toBeDefined();
  });
});
