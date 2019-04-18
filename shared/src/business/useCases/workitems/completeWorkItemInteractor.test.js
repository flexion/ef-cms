const { completeWorkItem } = require('./completeWorkItemInteractor');

describe('completeWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    assigneeId: 'docketclerk',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '2019-03-11T21:56:01.625Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Petitioner',
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
        saveWorkItem: async ({ workItemToSave }) => workItemToSave,
      }),
    };
    let error;
    try {
      await completeWorkItem({
        applicationContext,
        completedMessage: 'Completed',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
