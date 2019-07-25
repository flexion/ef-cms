const {
  getInboxMessagesForUserInteractor,
} = require('./getInboxMessagesForUserInteractor');

describe('getInboxMessagesForUserInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxyaper',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getDocumentQCServedForSection: async () => mockWorkItem,
      }),
    };
    let error;
    try {
      await getInboxMessagesForUserInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
