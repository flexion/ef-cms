const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  createCaseMessageInteractor,
} = require('./createCaseMessageInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');

describe('createCaseMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      createCaseMessageInteractor({
        applicationContext,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates the case message', async () => {
    const caseMessageData = {
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
        },
      ],
      docketNumber: '101-20',
      isRepliedTo: false,
      message: "How's it going?",
      subject: 'Hey!',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      })
      .mockReturnValueOnce({
        name: 'Test Petitionsclerk2',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'd90c8a79-9628-4ca9-97c6-02a161a02904',
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Guy Fieri, Petitioner',
        docketNumberWithSuffix: '123-45S',
        status: CASE_STATUS_TYPES.generalDocket,
      });

    await createCaseMessageInteractor({
      applicationContext,
      ...caseMessageData,
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().createCaseMessage.mock
        .calls[0][0].caseMessage,
    ).toMatchObject({
      ...caseMessageData,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Guy Fieri',
      docketNumber: '101-20',
      docketNumberWithSuffix: '123-45S',
      from: 'Test Petitionsclerk',
      fromSection: PETITIONS_SECTION,
      fromUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      to: 'Test Petitionsclerk2',
    });
  });
});
