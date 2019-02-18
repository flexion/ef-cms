const assert = require('assert');

const WorkItem = require('./WorkItem');
const Message = require('./Message');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('Creates a valid workitem', () => {
      const workItem = new WorkItem({
        messages: [],
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        section: 'docket',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem({
        messages: [],
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        section: 'docket',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Create a valid workitem without messages', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        section: 'docket',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Create a valid workitem with real message', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        section: 'docket',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
        messages: [
          {
            message: 'abc',
            userId: 'abc',
            sentBy: 'abc',
          },
        ],
      });
      assert.ok(workItem.isValid());
    });
  });

  describe('acquires messages', () => {
    it('when calling add message', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
        messages: [],
      });
      workItem.addMessage(
        new Message({
          message: 'abc',
          userId: 'abc',
          sentBy: 'abc',
        }),
      );
      assert.ok(workItem.messages.length === 1);
    });

    it('when set as completed', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
        messages: [],
      });
      workItem.setAsCompleted('jane');
      expect(workItem.messages.length === 1).toBe(true);
      expect(workItem.messages[0].message).toEqual('work item completed');
    });
  });
});
