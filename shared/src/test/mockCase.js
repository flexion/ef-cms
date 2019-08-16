const { MOCK_DOCUMENTS } = require('./mockDocuments');

exports.MOCK_CASE = {
  caseCaption: 'Test Taxpayer, Petitioner',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  contactPrimary: {
    name: 'Test Taxpayer',
    title: 'Executor',
  },
  docketNumber: '101-18',
  documents: MOCK_DOCUMENTS,
  filingType: 'Myself',
  hasIrsNotice: true,
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: 'Petitioner',
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};

exports.MOCK_CASE_WITHOUT_NOTICE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  contactPrimary: {
    name: 'Test Taxpayer',
    title: 'Executor',
  },
  docketNumber: '101-18',
  documents: MOCK_DOCUMENTS,
  filingType: 'Myself',
  partyType: 'Petitioner',
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
};
