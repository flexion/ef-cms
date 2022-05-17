/* eslint-disable max-lines */
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  updateTrialSessionInteractor,
} = require('./updateTrialSessionInteractor');
const { Case } = require('../../entities/cases/Case');
const { faker } = require('@faker-js/faker');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_INPERSON } = require('../../../test/mockTrial');
const { User } = require('../../entities/User');

describe('updateTrialSessionInteractor', () => {
  let mockTrialsById;
  let inPersonTrialSession;
  let user;

  const MOCK_REMOTE_TRIAL = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const serviceInfo = {
    docketEntryId: '',
    hasPaper: false,
    url: 'www.example.com',
  };

  const MOCK_TRIAL_ID_1 = '8a3ed061-bdc6-44f0-baec-7e2c007c51bb';
  const MOCK_TRIAL_ID_2 = '84949ffd-9aed-4595-b6af-ff91ea01112b';
  const MOCK_TRIAL_ID_3 = '76cfdfee-795a-4056-a383-8622e5d527d1';
  const MOCK_TRIAL_ID_4 = '195bd58c-e81e-44b5-90e2-b9f0a39575d6';
  const MOCK_TRIAL_ID_5 = '5674b900-517d-4ffc-81c0-140302c10010';
  const MOCK_TRIAL_ID_6 = 'd0293e71-155d-4cdd-9f3d-b21a72b64e51';
  const MOCK_TRIAL_ID_7 = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';

  const mockCaseRemovedFromTrialDocketNumber = '321-56';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
      });

    // because of this, you'll get some errors on some other tests
  });

  beforeEach(() => {
    mockTrialsById = {
      [MOCK_TRIAL_ID_1]: {
        ...MOCK_REMOTE_TRIAL,
        startDate: '2019-12-01T00:00:00.000Z',
        trialSessionId: MOCK_TRIAL_ID_1,
      },
      [MOCK_TRIAL_ID_2]: {
        ...MOCK_REMOTE_TRIAL,
        trialSessionId: MOCK_TRIAL_ID_2,
      },
      [MOCK_TRIAL_ID_3]: {
        ...MOCK_REMOTE_TRIAL,
        isCalendared: false,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialSessionId: MOCK_TRIAL_ID_3,
      },
      [MOCK_TRIAL_ID_4]: {
        ...MOCK_REMOTE_TRIAL,
        caseOrder: [
          { docketNumber: '123-45' },
          { docketNumber: '111-22' },
          { docketNumber: '999-99' },
        ],
        chambersPhoneNumber: '653-541-5542',
        isCalendared: true,
        joinPhoneNumber: '321-444-5791',
        meetingId: '55adcc88-cb98-4d0b-918d-d0add8d723cc',
        password: 'pass1234',
        trialSessionId: MOCK_TRIAL_ID_4,
      },
      [MOCK_TRIAL_ID_5]: {
        ...MOCK_REMOTE_TRIAL,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialClerk: { userId: '267c3601-0296-47dd-bb5a-91d34fe166b3' },
        trialSessionId: MOCK_TRIAL_ID_5,
      },
      [MOCK_TRIAL_ID_6]: {
        ...MOCK_REMOTE_TRIAL,
        isCalendared: false,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialSessionId: MOCK_TRIAL_ID_6,
      },
      [MOCK_TRIAL_ID_7]: {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          { docketNumber: '123-79' },
          { docketNumber: '999-99' },
          {
            docketNumber: '888-88',
          },
          {
            disposition: 'no longer on trial session',
            docketNumber: mockCaseRemovedFromTrialDocketNumber,
            removedFromTrial: true,
            removedFromTrialDate: '2025-12-01T00:00:00.000Z',
          },
        ],
        isCalendared: true,
      },
    };

    inPersonTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_7],
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    };

    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(
        ({ trialSessionId }) => mockTrialsById[trialSessionId],
      );

    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(trial => trial.trialSession);

    applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf.mockReturnValue(serviceInfo);
  });

  it('throws error if user is unauthorized', async () => {
    user = new User({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_REMOTE_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the trial session start date has passed', async () => {
    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: mockTrialsById[MOCK_TRIAL_ID_1],
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to update a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockImplementation(() => {
        throw new Error('Error!');
      });

    await expect(
      updateTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_REMOTE_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('updates a trial session successfully', async () => {
    await updateTrialSessionInteractor(applicationContext, {
      trialSession: mockTrialsById[MOCK_TRIAL_ID_2],
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and a judge was not set on the old session', async () => {
    const trialSessionWithJudge = {
      ...mockTrialsById[MOCK_TRIAL_ID_2],
      judge: {
        name: 'Judge Goodman',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      },
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: trialSessionWithJudge,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a judge is set on the updated trial session and it is a different judge than was on the old session', async () => {
    const trialSessionWithJudge = {
      ...mockTrialsById[MOCK_TRIAL_ID_3],
      judge: {
        name: 'Judge North',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      }, // different judge id
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: trialSessionWithJudge,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('creates a trial session working copy successfully if a trial clerk is set on the updated trial session and a trial clerk was not set on the old session', async () => {
    const trialSessionWithTrialClerk = {
      ...mockTrialsById[MOCK_TRIAL_ID_2],
      trialClerk: {
        name: 'Clerk McIntosh',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      },
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: trialSessionWithTrialClerk,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy.userId,
    ).toEqual('c7d90c05-f6cd-442c-a168-202db587f16f');
  });

  it('creates a trial session working copy successfully if a trial clerk is set on the updated trial session and it is a different trial clerk than was on the old session', async () => {
    const trialSessionWithTrialClerk = {
      ...mockTrialsById[MOCK_TRIAL_ID_5],
      trialClerk: {
        name: 'Clerk Magni',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      }, // different trial clerk id
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: trialSessionWithTrialClerk,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
        .mock.calls[0][0].trialSessionWorkingCopy.userId,
    ).toEqual('c7d90c05-f6cd-442c-a168-202db587f16f');
  });

  it('should update the hearing mapping with new trial session info when a hearing trialSessionId matches the case.trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...MOCK_CASE,
        docketNumber: '123-45',
        hearings: [mockTrialsById[MOCK_TRIAL_ID_4]],
        trialDate: '2045-12-01T00:00:00.000Z',
      });

    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      judge: { name: 'Shoeless Joe Jackson', userId: faker.datatype.uuid() },
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: calendaredTrialSession,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseHearing.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      docketNumber: '123-45',
      hearingToUpdate: calendaredTrialSession,
    });
  });

  it('should update the calendared case with new trial session info when the trialSessionId matches the case.trialSessionId', async () => {
    const mockCalendaredCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '123-45',
        trialDate: '2045-12-01T00:00:00.000Z',
        trialSessionId: MOCK_TRIAL_ID_4,
      },
      { applicationContext },
    );
    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      startDate: '2025-12-02T00:00:00.000Z',
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(
        mockCalendaredCase.toRawObject(),
      );

    mockCalendaredCase.updateTrialSessionInformation(MOCK_REMOTE_TRIAL);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...calendaredTrialSession,
        startDate: '2025-12-02T00:00:00.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      trialDate: '2025-12-02T00:00:00.000Z',
    });
  });

  it('updates editable fields', async () => {
    const updatedFields = {
      address1: '123 Main St',
      address2: 'Apt 234',
      chambersPhoneNumber: '111111',
      city: 'Somewhere',
      courtReporter: 'Someone Reporter',
      courthouseName: 'The Courthouse',
      irsCalendarAdministrator: 'Admin',
      joinPhoneNumber: '22222',
      judge: {
        name: 'Judge Buch',
        userId: '96bf390d-7418-41a3-b411-f1d8d89fb3d8',
      },
      maxCases: 1,
      meetingId: '333333',
      notes: 'some notes',
      password: '444444',
      postalCode: '12345',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.motionHearing,
      startDate: '2025-12-02T00:00:00.000Z',
      startTime: '10:00',
      state: 'TN',
      swingSession: true,
      swingSessionId: '70fa4d58-0ade-4e22-95e2-a98322f999b5',
      term: 'Spring',
      termYear: '2021',
      trialClerk: {
        name: 'The Clerk',
        userId: '200d96ac-7edc-407d-a3a7-a3e7db78b881',
      },
      trialLocation: 'Boise, Idaho',
    };

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...mockTrialsById[MOCK_TRIAL_ID_6],
        ...updatedFields,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...mockTrialsById[MOCK_TRIAL_ID_6],
      ...updatedFields,
    });
  });

  it('should not update the calendared case with new trial session info when the trialSessionId does NOT match the case.trialSessionId', async () => {
    const calendaredTrialSession = {
      ...mockTrialsById[MOCK_TRIAL_ID_4],
      startDate: '2025-12-02T00:00:00.000Z',
    };
    const mockCalendaredCase = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '123-45',
        hearings: [calendaredTrialSession],
        trialSessionId: MOCK_TRIAL_ID_3,
      },
      { applicationContext },
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(
        mockCalendaredCase.toRawObject(),
      );
    mockCalendaredCase.updateTrialSessionInformation(MOCK_REMOTE_TRIAL);

    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...calendaredTrialSession,
        startDate: '2025-12-02T00:00:00.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('does not update non-editable fields', async () => {
    await updateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...mockTrialsById[MOCK_TRIAL_ID_6],
        isCalendared: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate.isCalendared,
    ).toEqual(false);
  });

  it('should not retrieve the case from persistence when it has been removed from the trial session', async () => {
    await updateTrialSessionInteractor(applicationContext, {
      trialSession: inPersonTrialSession,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalledWith({
      applicationContext,
      docketNumber: mockCaseRemovedFromTrialDocketNumber,
    });
  });

  describe('should Generate Notices of', () => {
    describe('In-Person Proceeding', () => {
      it('should not generate notices for the cases on the trial session that have been removed when the trial session has been changed', async () => {
        const firstOpenCase = {
          ...MOCK_CASE,
          docketNumber: '888-88',
          docketNumberWithSuffix: '888-88',
          hearings: [],
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };
        const secondOpenCase = {
          ...MOCK_CASE,
          docketNumber: '123-79',
          docketNumberWithSuffix: '123-79',
          hearings: [],
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };
        const closedCase = {
          ...MOCK_CASE,
          closedDate: '2020-03-01T21:42:29.073Z',
          docketNumber: '999-99',
          docketNumberWithSuffix: '999-99',
          hearings: [],
          status: CASE_STATUS_TYPES.closed,
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce(firstOpenCase)
          .mockReturnValueOnce(secondOpenCase)
          .mockReturnValueOnce(closedCase);

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: inPersonTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToInPersonProceeding,
        ).toHaveBeenCalledTimes(3);
      });

      it('should NOT generate a NOIP when the proceeding type changes from remote to in-person, the case status is not closed but the trial session is NOT calendared', async () => {
        const inPersonNonCalendaredTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_3],
          isCalendared: false,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            docketNumber: '888-88',
            docketNumberWithSuffix: '888-88',
            hearings: [],
            trialDate: '2019-03-01T21:42:29.073Z',
            trialSessionId: MOCK_TRIAL_ID_3,
          });

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: inPersonNonCalendaredTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToInPersonProceeding,
        ).not.toHaveBeenCalled();
      });

      it('should NOT generate a NOIP when the proceeding type changes from remote to in-person, the trial session is calendared but the case is closed', async () => {
        const mockInPersonCalendaredTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_4],
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            closedDate: '2019-03-01T21:42:29.073Z',
            docketNumber: '888-88',
            docketNumberWithSuffix: '888-88',
            hearings: [],
            status: CASE_STATUS_TYPES.closed,
            trialDate: '2019-03-01T21:42:29.073Z',
            trialSessionId: MOCK_TRIAL_ID_4,
          });

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: mockInPersonCalendaredTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToInPersonProceeding,
        ).not.toHaveBeenCalled();
      });

      it('should NOT generate a NOIP when the case status is open, the trial session is calendared but the trial session proceeding type has not changed', async () => {
        await updateTrialSessionInteractor(applicationContext, {
          trialSession: mockTrialsById[MOCK_TRIAL_ID_4],
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToInPersonProceeding,
        ).not.toHaveBeenCalled();
      });

      it('should generate a NOIP when the proceeding type changes from remote to in-person, the case status is not closed, and the trial session is calendared', async () => {
        const inPersonTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_4],
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            docketNumber: '888-88',
            docketNumberWithSuffix: '888-88',
            hearings: [],
            trialDate: '2019-03-01T21:42:29.073Z',
            trialSessionId: MOCK_TRIAL_ID_4,
          });

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: inPersonTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToInPersonProceeding,
        ).toHaveBeenCalled();
      });
    });

    describe('Remote Proceeding', () => {
      it.skip('should setNoticeOfChangeToRemoteProceeding for each open case on the trial session', async () => {
        const firstOpenCase = {
          ...MOCK_CASE,
          docketNumber: '123-79',
          docketNumberWithSuffix: '123-79',
          hearings: [mockTrialsById[MOCK_TRIAL_ID_7]],
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };
        const secondOpenCase = {
          ...MOCK_CASE,
          docketNumber: '888-88',
          docketNumberWithSuffix: '888-88',
          hearings: [mockTrialsById[MOCK_TRIAL_ID_7]],
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };
        const closedCase = {
          ...MOCK_CASE,
          closedDate: '2020-03-01T21:42:29.073Z',
          docketNumber: '999-99',
          docketNumberWithSuffix: '999-99',
          hearings: [mockTrialsById[MOCK_TRIAL_ID_7]],
          status: CASE_STATUS_TYPES.closed,
          trialDate: '2019-03-01T21:42:29.073Z',
          trialSessionId: MOCK_TRIAL_ID_7,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockResolvedValueOnce(firstOpenCase)
          .mockResolvedValueOnce(secondOpenCase)
          .mockResolvedValueOnce(closedCase);

        const remoteTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_7],
          chambersPhoneNumber: '111111',
          joinPhoneNumber: '222222',
          meetingId: '333333',
          password: '4444444',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        };

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: remoteTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToRemoteProceeding,
        ).toHaveBeenCalledTimes(3);
        expect(
          applicationContext.getUseCaseHelpers().savePaperServicePdf,
        ).toHaveBeenCalledTimes(1);
        expect(
          applicationContext.getNotificationGateway().sendNotificationToUser,
        ).toHaveBeenCalled();
        expect(
          applicationContext.getNotificationGateway().sendNotificationToUser
            .mock.calls[0][0],
        ).toMatchObject({
          message: {
            action: 'update_trial_session_complete',
            hasPaper: serviceInfo?.hasPaper,
            pdfUrl: 'www.example.com',
            trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
          },
          userId: user.userId,
        });
      });

      it('should NOT generate a NORP when the case status is open, the trial session is calendared but the trial session proceeding type has not changed', async () => {
        await updateTrialSessionInteractor(applicationContext, {
          trialSession: mockTrialsById[MOCK_TRIAL_ID_4],
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToRemoteProceeding,
        ).not.toHaveBeenCalled();
      });

      it('should NOT generate a NORP when the proceeding type changes from in-person to remote, the trial session is calendared but the case is closed', async () => {
        const mockRemoteCalendaredTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_7],
          chambersPhoneNumber: '1111111',
          joinPhoneNumber: '0987654321',
          meetingId: '1234567890',
          password: 'abcdefg',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            closedDate: '2019-03-01T21:42:29.073Z',
            docketNumber: '888-88',
            docketNumberWithSuffix: '888-88',
            hearings: [],
            status: CASE_STATUS_TYPES.closed,
            trialDate: '2019-03-01T21:42:29.073Z',
            trialSessionId: MOCK_TRIAL_ID_7,
          });

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: mockRemoteCalendaredTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToRemoteProceeding,
        ).not.toHaveBeenCalled();
      });

      it('should generate a NORP when the proceeding type changes from in-person to remote, the case status is not closed, and the trial session is calendared', async () => {
        const mockRemoteCalendaredTrialSession = {
          ...mockTrialsById[MOCK_TRIAL_ID_7],
          chambersPhoneNumber: '1111111',
          joinPhoneNumber: '0987654321',
          meetingId: '1234567890',
          password: 'abcdefg',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        };

        applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber.mockReturnValueOnce({
            ...MOCK_CASE,
            docketNumber: '888-88',
            docketNumberWithSuffix: '888-88',
            hearings: [],
            trialDate: '2019-03-01T21:42:29.073Z',
            trialSessionId: MOCK_TRIAL_ID_7,
          });

        await updateTrialSessionInteractor(applicationContext, {
          trialSession: mockRemoteCalendaredTrialSession,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .setNoticeOfChangeToRemoteProceeding,
        ).toHaveBeenCalled();
      });
    });
  });
});
