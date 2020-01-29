const {
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/cases/CaseConstants');
const { associateRespondentToCase } = require('./associateRespondentToCase');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('associateRespondentToCase', () => {
  let applicationContext;

  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    docketNumber: '123-19',
    docketRecord: [
      {
        createdAt: '2018-03-01T00:01:00.000Z',
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        index: 1,
      },
    ],
    documents: MOCK_CASE.documents,
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    status: 'New',
  };

  it('should not add mapping if already there', async () => {
    let associateUserWithCaseSpy = jest.fn();
    let verifyCaseForUserSpy = jest.fn().mockReturnValue(true);
    let updateCaseSpy = jest.fn();

    const user = {
      name: 'Olivia Jade',
      role: User.ROLES.respondent,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext = {
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await associateRespondentToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
    });

    expect(associateUserWithCaseSpy).not.toBeCalled();
    expect(updateCaseSpy).not.toBeCalled();
  });

  it('should add mapping for a respondent', async () => {
    let associateUserWithCaseSpy = jest.fn();
    let verifyCaseForUserSpy = jest.fn().mockReturnValue(false);
    let updateCaseSpy = jest.fn();

    const user = {
      name: 'Olivia Jade',
      role: User.ROLES.respondent,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext = {
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await associateRespondentToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user,
    });

    expect(associateUserWithCaseSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      respondents: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
    });
  });
});
