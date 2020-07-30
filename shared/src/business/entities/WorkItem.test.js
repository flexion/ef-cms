const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { WorkItem } = require('./WorkItem');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new WorkItem({}, {})).toThrow();
    });

    it('Creates a valid workitem', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          document: {},
          isQC: true,
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Creates a valid workitem when using setStatus', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          document: {},
          isQC: true,
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      workItem.setStatus(CASE_STATUS_TYPES.new);
      expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Returns a reference to a valid workItem when calling setAsInternal', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          document: {},
          isQC: true,
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      const updatedWorkItem = workItem.setAsInternal();
      expect(updatedWorkItem.isQC).toEqual(false);
      expect(updatedWorkItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          document: {},
          isQC: true,
          section: 'docket',
          sentBy: 'bob',
          workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a isRead', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          document: {},
          isQC: true,
          isRead: true,
          section: 'docket',
          sentBy: 'bob',
          workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });
  });

  it('assigns user provided to `assignUser`', () => {
    const workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        document: {},
        isQC: true,
        sentBy: 'bob',
      },
      { applicationContext },
    );

    const assignment = {
      assigneeId: '111cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'Joe',
      section: 'Some Section',
      sentBy: 'Sender Name',
      sentBySection: 'Sender Section',
      sentByUserId: '222cd447-6278-461b-b62b-d9e357eea62c',
    };
    workItem.assignToUser(assignment);
    expect(workItem.toRawObject()).toMatchObject(assignment);
  });
});
