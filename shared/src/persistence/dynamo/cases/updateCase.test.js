jest.mock('../../dynamodbClientService');
const client = require('../../dynamodbClientService');
const { Case } = require('../../../business/entities/cases/Case');
const { updateCase } = require('./updateCase');

describe('updateCase', () => {
  let applicationContext;

  const putStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  let getStub = jest.fn().mockReturnValue({
    docketNumberSuffix: null,
    inProgress: false,
    respondents: [],
    status: Case.STATUS_TYPES.generalDocket,
  });

  let queryStub;

  const deleteStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  const updateStub = jest.fn();

  client.get = getStub;
  client.put = putStub;
  client.update = updateStub;
  client.delete = deleteStub;

  let firstQueryStub;

  beforeEach(() => {
    jest.clearAllMocks();

    firstQueryStub = [
      {
        docketNumberSuffix: null,
        inProgress: false,
        pk: 'case|123',
        sk: 'case|123',
        status: Case.STATUS_TYPES.generalDocket,
      },
    ];

    queryStub = jest
      .fn()
      .mockReturnValueOnce(firstQueryStub)
      .mockReturnValue([
        {
          sk: '123',
        },
      ]);
    client.query = queryStub;

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getUniqueId: () => 'unique-id-1',
    };
  });

  it('updates case', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
        userId: 'petitioner',
      },
    });
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
  });

  it('updates fields on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseCaption: 'New caption',
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: 'W',
        inProgress: true,
        status: Case.STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:40:46.415Z',
        userId: 'petitioner',
      },
    });
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseStatus': Case.STATUS_TYPES.calendared,
      },
    });
    expect(updateStub.mock.calls[1][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseTitle': 'New caption',
      },
    });
    expect(updateStub.mock.calls[2][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':docketNumberSuffix': 'W',
      },
    });
    expect(updateStub.mock.calls[3][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
    });
    expect(updateStub.mock.calls[4][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
    expect(updateStub.mock.calls[5][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':caseIsInProgress': true,
      },
    });
  });

  it('updates associated judge on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseId: '123',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
      },
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
  });

  it('does not update work items if work item fields are unchanged', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumberSuffix: null,
        status: Case.STATUS_TYPES.generalDocket,
      },
    });
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
    expect(updateStub).not.toBeCalled();
  });

  describe('Respondents', () => {
    it('adds a respondent to a case with no existing respondents', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          respondents: [{ name: 'Guy Fieri', userId: 'user-id-existing-234' }],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        pk: 'case|123',
        sk: 'respondent|user-id-existing-234',
        userId: 'user-id-existing-234',
      });
    });

    it('adds a respondent to a case with existing respondents', async () => {
      getStub.mockReturnValue({
        docketNumberSuffix: null,
        inProgress: false,
        respondents: [
          { name: 'Guy Fieri', userId: 'user-id-existing-123' },
          { name: 'Rachel Ray', userId: 'user-id-existing-234' },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          respondents: [
            {
              name: 'Bobby Flay',
              userId: 'user-id-new-321',
            },
            { name: 'Guy Fieri', userId: 'user-id-existing-123' },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        pk: 'case|123',
        sk: 'respondent|user-id-new-321',
        userId: 'user-id-new-321',
      });
    });

    it('updates a respondent on a case', async () => {
      firstQueryStub.push({
        name: 'Guy Fieri',
        pk: 'case|123',
        sk: 'respondent|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
      firstQueryStub.push({
        name: 'Rachel Ray',
        pk: 'case|123',
        sk: 'respondent|user-id-existing-234',
        userId: 'user-id-existing-234',
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          respondents: [
            {
              motto: 'Welcome to Flavortown!',
              name: 'Guy Fieri',
              userId: 'user-id-existing-123',
            },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        motto: 'Welcome to Flavortown!',
        pk: 'case|123',
        sk: 'respondent|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
    });

    fit('removes a respondent from a case with existing respondents', async () => {
      firstQueryStub.push({
        name: 'Guy Fieri',
        pk: 'case|123',
        sk: 'respondent|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
      firstQueryStub.push({
        name: 'Rachel Ray',
        pk: 'case|123',
        sk: 'respondent|user-id-existing-234',
        userId: 'user-id-existing-234',
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          respondents: [
            {
              name: 'Rachel Ray',
              userId: 'user-id-existing-234',
            },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).toHaveBeenCalled();
      expect(putStub.mock.calls.length).toEqual(1);
      expect(putStub.mock.calls[0][0].Item.respondents).toMatchObject([
        { name: 'Rachel Ray', userId: 'user-id-existing-234' },
      ]);
    });
  });

  describe('Practitioners', () => {
    it('adds a practitioner to a case with no existing practitioners', async () => {
      getStub.mockReturnValue({
        docketNumberSuffix: null,
        inProgress: false,
        practitioners: [],
        status: Case.STATUS_TYPES.generalDocket,
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          practitioners: [
            { name: 'Guy Fieri', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        pk: 'case|123',
        sk: 'practitioner|user-id-existing-234',
        userId: 'user-id-existing-234',
      });
    });

    it('adds a practitioner to a case with existing practitioners', async () => {
      getStub.mockReturnValue({
        docketNumberSuffix: null,
        inProgress: false,
        practitioners: [
          { name: 'Guy Fieri', userId: 'user-id-existing-123' },
          { name: 'Rachel Ray', userId: 'user-id-existing-234' },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          practitioners: [
            {
              name: 'Bobby Flay',
              userId: 'user-id-new-321',
            },
            { name: 'Guy Fieri', userId: 'user-id-existing-123' },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        pk: 'case|123',
        sk: 'practitioner|user-id-new-321',
        userId: 'user-id-new-321',
      });
    });

    it('updates a practitioner on a case', async () => {
      getStub.mockReturnValue({
        docketNumberSuffix: null,
        inProgress: false,
        practitioners: [
          { name: 'Guy Fieri', userId: 'user-id-existing-123' },
          { name: 'Rachel Ray', userId: 'user-id-existing-234' },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          practitioners: [
            {
              motto: 'Welcome to Flavortown!',
              name: 'Guy Fieri',
              userId: 'user-id-existing-123',
            },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).not.toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls[0][0].Item).toMatchObject({
        motto: 'Welcome to Flavortown!',
        pk: 'case|123',
        sk: 'practitioner|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
    });

    it('removes a practitioner from a case with existing practitioners', async () => {
      getStub.mockReturnValue({
        docketNumberSuffix: null,
        inProgress: false,
        practitioners: [
          { name: 'Guy Fieri', userId: 'user-id-existing-123' },
          { name: 'Rachel Ray', userId: 'user-id-existing-234' },
        ],
        status: Case.STATUS_TYPES.generalDocket,
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          practitioners: [
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: Case.STATUS_TYPES.generalDocket,
        },
      });

      expect(deleteStub).toHaveBeenCalled();
      expect(putStub.mock.calls.length).toEqual(1);
      expect(putStub.mock.calls[0][0].Item.practitioners).toMatchObject([
        { name: 'Rachel Ray', userId: 'user-id-existing-234' },
      ]);
    });
  });
});
