/* eslint-disable max-lines */
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
  fileDocumentOnOneCase,
} = require('./fileDocumentOnOneCase');
const {
  DOCKET_SECTION,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const { Case } = require('../../entities/cases/Case');
const { docketClerkUser, judgeUser } = require('../../../test/mockUsers');
const { DocketEntry } = require('../../entities/DocketEntry');
const { MOCK_CASE } = require('../../../test/mockCase');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { WorkItem } = require('../../entities/WorkItem');

describe('fileDocumentOnOneCase', () => {
  let mockCaseEntity;

  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';

  jest.spyOn(Case.prototype, 'addDocketEntry');
  jest.spyOn(Case.prototype, 'updateDocketEntry');
  jest.spyOn(DocketEntry.prototype, 'setAsServed');
  jest.spyOn(WorkItem.prototype, 'validate');
  jest.spyOn(WorkItem.prototype, 'assignToUser');
  jest.spyOn(WorkItem.prototype, 'setAsCompleted');

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      applicationContext,
    });

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );
  });

  it('should populate attachments, date, documentTitle, documentType, eventCode, freeText, scenario, and serviceStamp from the form on the docketEntry', async () => {
    const mockAttachments = true;
    const mockDate = '2009-03-01T21:40:46.415Z';
    const mockDocumentTitle = 'Important Filing';
    const mockDocumentType = 'Order';
    const mockEventCode = 'O';
    const mockFreeText = 'Hurry! This is urgent';
    const mockScenario = 'Standard';
    const mockServiceStamp = 'Blah blah blah';

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        attachments: mockAttachments,
        date: mockDate,
        documentType: mockDocumentType,
        eventCode: mockEventCode,
        freeText: mockFreeText,
        generatedDocumentTitle: mockDocumentTitle,
        scenario: mockScenario,
        serviceStamp: mockServiceStamp,
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry).toMatchObject({
      attachments: mockAttachments,
      date: mockDate,
      documentTitle: mockDocumentTitle,
      documentType: mockDocumentType,
      eventCode: mockEventCode,
      freeText: mockFreeText,
      scenario: mockScenario,
      serviceStamp: mockServiceStamp,
    });
  });

  it('should not use filedBy from the original docket entry to populate the new docketEntry`s filedBy value', async () => {
    const mockFiledBy = 'Someone';

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        filedBy: mockFiledBy,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.filedBy).not.toBe(mockFiledBy);
  });

  it('should set isOnDocketRecord to true on the created docketEntry', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.isOnDocketRecord).toBe(true);
  });

  it('should mark the docketEntry as NOT a draft', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        isDraft: true,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.isDraft).toBe(false);
  });

  it('should set the docketEntry as served', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        draftOrderState: 'abc',
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(DocketEntry.prototype.setAsServed).toHaveBeenCalled();
  });

  it('should create a new work item for the docketEntry when it does not already have one', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: undefined,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem).toBeDefined();
  });

  it('should create a new work item for the docketEntry when the docketNumber on the originalSubjectDocketEntry does not match the docketNumber of the case to file the docketEntry on', async () => {
    const differentDocketNumber = '3875-32';
    const mockWorkItem = {
      docketNumber: differentDocketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        docketNumber: differentDocketNumber,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: mockWorkItem,
      },
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem.docketNumber).toBe(
      mockCaseEntity.docketNumber,
    );
  });

  it('should set docketEntry.workItem.leadDocketNumber from caseEntity.leadDocketNumber', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem.leadDocketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should assign the docketEntry`s work item to the provided user', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.assignToUser).toHaveBeenCalledWith({
      assigneeId: docketClerkUser.userId,
      assigneeName: docketClerkUser.name,
      section: docketClerkUser.section,
      sentBy: docketClerkUser.name,
      sentBySection: docketClerkUser.section,
      sentByUserId: docketClerkUser.userId,
    });
  });

  it('should set the docketEntry`s work item as completed by the provided user', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.setAsCompleted).toHaveBeenCalledWith({
      message: 'completed',
      user: docketClerkUser,
    });
  });

  it('should update the docketEntry on the caseEntity when it already existed on the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockCaseEntity.docketEntries[0].docketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(Case.prototype.updateDocketEntry).toHaveBeenCalled();
  });

  it('should add the docketEntry on the caseEntity when it did NOT already exist on the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(Case.prototype.addDocketEntry).toHaveBeenCalled();
  });

  it('should validate the docketEntry`s work item', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.validate).toHaveBeenCalled();
  });

  it('should make a call to save the docketEntry`s work item', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should make a call to put the docketEntry`s work item in the user`s outbox', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should make a call to close the case and update trial session information when the docketEntry being filed is one of "ENTERED_AND_SERVED_EVENT_CODES"', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: ENTERED_AND_SERVED_EVENT_CODES[0],
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(Case.prototype.closeCase).toHaveBeenCalled();
  });

  it('should make a call save the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should return the updated case entity', async () => {
    const result = await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      form: {
        documentType: 'Order',
        eventCode: 'O',
      },
      numberOfPages: 1,
      originalSubjectDocketEntry: {
        docketEntryId: mockDocketEntryId,
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      user: docketClerkUser,
    });

    expect(result.entityName).toBe('Case');
    expect(
      result.getDocketEntryById({ docketEntryId: mockDocketEntryId }),
    ).toBeDefined();
  });

  describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
    const mockTrialSessionId = '414ca21e-1399-4a2f-8f24-06cad634f359';
    const mockTrialSession = {
      caseOrder: [],
      judge: {
        name: 'Judge Colvin',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      startDate: '2019-11-27T05:00:00.000Z',
      startTime: '10:00',
      swingSession: true,
      swingSessionId: mockTrialSessionId,
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Houston, Texas',
      trialSessionId: mockTrialSessionId,
    };

    jest.spyOn(Case.prototype, 'closeCase');
    jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
    jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
    jest.spyOn(TrialSession.prototype, 'validate');

    it('should close the case', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: mockCaseEntity,
      });

      expect(Case.prototype.closeCase).toHaveBeenCalled();
    });

    it('should make a call to delete the case trial sort mapping records', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: mockCaseEntity,
      });

      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
      ).toBe(mockCaseEntity.docketNumber);
    });

    it('should return early when the case does NOT have a trialSessionId set', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: undefined },
          { applicationContext },
        ),
      });

      expect(
        applicationContext.getPersistenceGateway().getTrialSessionById,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).not.toHaveBeenCalled();
    });

    it('should remove the case from the calendar when the trialSession it`s scheduled on is already calendared', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: true,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        TrialSession.prototype.removeCaseFromCalendar,
      ).toHaveBeenCalledWith({
        disposition: 'Status was changed to Closed',
        docketNumber: mockCaseEntity.docketNumber,
      });
    });

    it('should delete the case from the calendar when the trialSession it`s scheduled on is NOT already calendared', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: false,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        TrialSession.prototype.deleteCaseFromCalendar,
      ).toHaveBeenCalledWith({
        docketNumber: mockCaseEntity.docketNumber,
      });
    });

    it('should not persist the trial session changes when it`s not valid', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          proceedingType: null, // Required on TrialSession entity
        });

      await expect(
        closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
          applicationContext,
          caseEntity: new Case(
            { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
            { applicationContext },
          ),
        }),
      ).rejects.toThrow();

      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).not.toHaveBeenCalled();
    });

    it('should make a call to persist the changes to the trial session', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: false,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).toHaveBeenCalled();
    });
  });
});
