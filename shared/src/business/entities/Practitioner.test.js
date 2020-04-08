const { Practitioner } = require('./Practitioner');
const { User } = require('./User');

describe('Practitioner', () => {
  it('Creates a valid Practitioner with all required fields', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      isAdmitted: true,
      name: 'Test Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid Practitioner with missing required fields', () => {
    const user = new Practitioner({
      role: User.ROLES.Practitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid employer option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Attorney',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid practitionerType option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      firmName: 'GW Law Offices',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Purple',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid admissionsStatus option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Invalid',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      firmName: 'GW Law Offices',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Purple',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('should set the role to "irsPractitioner" when employer is "IRS" and isAdmitted is true', () => {
    const user = new Practitioner({
      employer: 'IRS',
      isAdmitted: true,
    });
    expect(user.role).toEqual(User.ROLES.irsPractitioner);
  });

  it('should set the role to "irsPractitioner" when employer is "DOJ" and isAdmitted is true', () => {
    const user = new Practitioner({
      employer: 'DOJ',
      isAdmitted: true,
    });
    expect(user.role).toEqual(User.ROLES.irsPractitioner);
  });

  it('should set the role to "privatePractitioner" when employer is "Private" and isAdmitted is true', () => {
    const user = new Practitioner({
      employer: 'Private',
      isAdmitted: true,
    });
    expect(user.role).toEqual(User.ROLES.privatePractitioner);
  });

  it('should set the role to "inactivePractitioner" when employer is "Private" and isAdmitted is false', () => {
    const user = new Practitioner({
      employer: 'Private',
      isAdmitted: false,
    });
    expect(user.role).toEqual(User.ROLES.inactivePractitioner);
  });

  it('Combines firstName and lastName properties to set the name property if provided and isAdmitted is true', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      isAdmitted: true,
      lastName: 'Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.name).toEqual('Test Practitioner');
    expect(user.firstName).toBeUndefined();
    expect(user.latName).toBeUndefined();
  });
});
