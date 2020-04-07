const {
  validateAddPractitionerInteractor,
} = require('./validateAddPractitionerInteractor');
const { NewPractitioner } = require('../../entities/NewPractitioner');

describe('validateAddPractitionerInteractor', () => {
  it('returns the expected errors object on an empty practitioner', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          NewPractitioner,
        }),
      },
      practitioner: {},
    });

    expect(Object.keys(errors)).toEqual([
      'admissionsDate',
      'birthYear',
      'employer',
      'originalBarState',
      'practitionerType',
      'firstName',
      'lastName',
    ]);
  });

  it('returns null on no errors', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          NewPractitioner,
        }),
      },
      practitioner: {
        admissionsDate: '2019-03-01T21:40:46.415Z',
        birthYear: '2009',
        employer: 'IRS',
        firstName: 'Test',
        lastName: 'Practitioner',
        originalBarState: 'Texas',
        practitionerType: 'Attorney',
      },
    });

    expect(errors).toBeNull();
  });
});
