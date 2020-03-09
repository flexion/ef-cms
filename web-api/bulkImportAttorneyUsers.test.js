const { formatRecord } = require('./bulkImportAttorneyUsers');

describe('formatRecord', () => {
  it('formats a record for an admitted IRS employee', () => {
    const initialRecord = {
      admissionsStatus: 'Active',
      birthYear: '1999',
      firstName: 'Bob',
      isIrsEmployee: 'Y',
      lastName: 'Builder',
      middleName: 'the',
      suffix: 'yeswecan',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      birthYear: 1999,
      employer: 'IRS',
      isAdmitted: true,
      name: 'Bob the Builder yeswecan',
      role: 'respondent',
      section: 'respondent',
    });
  });

  it('formats a record for a non-admitted DOJ employee', () => {
    const initialRecord = {
      admissionsStatus: 'Ineligible',
      birthYear: '1999',
      firstName: 'Mike',
      isDojEmployee: 'Y',
      isIrsEmployee: 'N',
      lastName: 'Wazowski',
      middleName: '',
      suffix: '',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      birthYear: 1999,
      employer: 'DOJ',
      isAdmitted: false,
      name: 'Mike Wazowski',
      role: 'respondent',
      section: 'respondent',
    });
  });

  it('formats a record for an admitted private practitioner', () => {
    const initialRecord = {
      admissionsStatus: 'Active',
      birthYear: 'what',
      firstName: 'Rachael',
      isDojEmployee: 'N',
      isIrsEmployee: 'N',
      lastName: 'Ray',
      middleName: '',
      suffix: '',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      birthYear: undefined,
      employer: 'Private',
      isAdmitted: true,
      name: 'Rachael Ray',
      role: 'practitioner',
      section: 'practitioner',
    });
  });
});
