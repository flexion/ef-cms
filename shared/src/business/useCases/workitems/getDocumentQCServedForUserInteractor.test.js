const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentQCServedForUserInteractor,
} = require('./getDocumentQCServedForUserInteractor');
const { DOCKET_SECTION, ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getDocumentQCServedForUserInteractor', () => {
  let user;

  beforeEach(() => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext.getPersistenceGateway().getDocumentQCServedForUser = async () => [
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
    ];

    applicationContext.getUniqueId.mockReturnValue(
      '93bac4bd-d6ea-4ac7-8ff5-bf2501b1a1f2',
    );
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      getDocumentQCServedForUserInteractor({
        applicationContext,
        section: DOCKET_SECTION,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a petitions clerk', async () => {
    const result = await getDocumentQCServedForUserInteractor({
      applicationContext,
      section: DOCKET_SECTION,
    });
    expect(result).toMatchObject([
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
    ]);
  });

  it('successfully returns the work items for a docket clerk', async () => {
    user = {
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    };

    applicationContext.getCurrentUser.mockReturnValue(user);

    const result = await getDocumentQCServedForUserInteractor({
      applicationContext,
      section: DOCKET_SECTION,
    });
    expect(result).toMatchObject([
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
      {
        docketEntry: { sentBy: 'petitioner' },
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        section: DOCKET_SECTION,
        sentBy: 'docketclerk',
      },
    ]);
  });
});
