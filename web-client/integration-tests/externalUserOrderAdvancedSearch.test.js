import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('external users perform an advanced search for orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest, true);
  petitionsClerkAddsRespondentsToCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(integrationTest, {
    documentContents: 'this is a thing that I can search for, Jiminy Cricket',
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 0);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(integrationTest, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(integrationTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkSealsCase(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(
    integrationTest,
    {
      draftOrderIndex: 0,
      keyword: 'Jiminy Cricket',
    },
    true,
  );

  loginAs(integrationTest, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(
    integrationTest,
    {
      draftOrderIndex: 0,
      keyword: 'Jiminy Cricket',
    },
    true,
  );

  loginAs(integrationTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(integrationTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });
});
