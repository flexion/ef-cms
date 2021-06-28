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

describe('Modify Practitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  integrationTest.createdDocketNumbers = [];
  const practitionerEmail = 'privatePractitioner2@example.com';

  loginAs(integrationTest, practitionerEmail);
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(integrationTest, {}, practitionerEmail);
    expect(caseDetail.docketNumber).toBeDefined();
    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(integrationTest, 'practitioner');

  const mockUpdatedEmail = `${faker.internet.userName()}_no_error@example.com`;

  userSuccessfullyUpdatesEmailAddress(
    integrationTest,
    'practitioner',
    mockUpdatedEmail,
  );

  userVerifiesUpdatedEmailAddress(integrationTest, 'practitioner');

  loginAs(integrationTest, practitionerEmail);
  userLogsInAndChecksVerifiedEmailAddress(
    integrationTest,
    'practitioner',
    mockUpdatedEmail,
  );
});
