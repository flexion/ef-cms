const {
  getProcedureTypesInteractor,
} = require('./getProcedureTypesInteractor');
const { Case } = require('../entities/cases/Case');
const { User } = require('../entities/User');

const validateProcedureTypes = procedureTypes => {
  procedureTypes.forEach(procedureType => {
    if (!Case.PROCEDURE_TYPES.includes(procedureType)) {
      throw new Error('invalid procedure type');
    }
  });
};
describe('Get case procedure types', () => {
  beforeEach(() => {});

  it('returns a collection of procedure types', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'taxpayer',
        };
      },
    };
    const procedureTypes = await getProcedureTypesInteractor({
      applicationContext,
    });
    expect(procedureTypes.length).toEqual(2);
    expect(procedureTypes[0]).toEqual('Regular');
    expect(procedureTypes[1]).toEqual('Small');
    let error;
    try {
      validateProcedureTypes(procedureTypes);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });
});
