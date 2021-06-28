import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { userLogsInAndChecksVerifiedEmailAddress } from './journey/userLogsInAndChecksVerifiedEmailAddress';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userUpdatesEmailAddressToOneAlreadyInUse } from './journey/userUpdatesEmailAddressToOneAlreadyInUse';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';
import faker from 'faker';

const integrationTest = setupTest();

describe('Modify Petitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  integrationTest.createdDocketNumbers = [];

  loginAs(integrationTest, 'petitioner@example.com');
  it('petitioner creates a case', async () => {
    caseDetail = await uploadPetition(
      integrationTest,
      {},
      'petitioner@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(integrationTest, 'petitioner');

  const mockUpdatedEmail = `${faker.internet.userName()}_no_error@example.com`;
  userSuccessfullyUpdatesEmailAddress(
    integrationTest,
    'petitioner',
    mockUpdatedEmail,
  );

  userVerifiesUpdatedEmailAddress(integrationTest, 'petitioner');

  loginAs(integrationTest, 'petitioner@example.com');
  userLogsInAndChecksVerifiedEmailAddress(
    integrationTest,
    'petitioner',
    mockUpdatedEmail,
  );
});
