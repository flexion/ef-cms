const sinon = require('sinon');
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
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filingDate: '2018-03-01T00:01:00.000Z',
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
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(true);
    let updateCaseSpy = sinon.spy();

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
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(false);
  });

  it('should add mapping for a respondent', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

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
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
