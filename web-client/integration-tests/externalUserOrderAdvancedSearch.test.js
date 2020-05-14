import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('external users perform an advanced search for orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  describe('performing data entry', () => {
    loginAs(test, 'petitioner');
    it('Create test case #1', async () => {
      const caseDetail = await uploadPetition(test);
      expect(caseDetail).toBeDefined();
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk');
    petitionsClerkViewsCaseDetail(test);
    petitionsClerkAddsPractitionersToCase(test, true);
    petitionsClerkAddsRespondentsToCase(test);

    loginAs(test, 'docketclerk');
    docketClerkCreatesAnOrder(test, {
      documentContents: 'this is a thing that I can search for, Jiminy Cricket',
      documentTitle: 'Order',
      eventCode: 'O',
      expectedDocumentType: 'Order',
    });
    docketClerkAddsDocketEntryFromOrder(test, 0);
    docketClerkServesOrder(test, 0);
  });

  describe('lots of users can search for this new order', () => {
    beforeAll(async () => {
      await refreshElasticsearchIndex();
      await wait(5000);
    });
    loginAs(test, 'privatePractitioner');
    associatedUserSearchesForServedOrder(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'privatePractitioner1');
    unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'irsPractitioner');
    associatedUserSearchesForServedOrder(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'irsPractitioner2');
    unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });
  });

  describe('docket clerk seals the case and the same users cannot find the order anymore', () => {
    beforeAll(async () => {
      loginAs(test, 'docketclerk');
      docketClerkSealsCase(test);
      await refreshElasticsearchIndex();
      await wait(10000);
    });
    loginAs(test, 'privatePractitioner');
    associatedUserSearchesForServedOrder(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'privatePractitioner1');
    unassociatedUserSearchesForServedOrderInSealedCase(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'irsPractitioner');
    associatedUserSearchesForServedOrder(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });

    loginAs(test, 'irsPractitioner2');
    unassociatedUserSearchesForServedOrderInSealedCase(test, {
      draftOrderIndex: 0,
      orderKeyword: 'Jiminy Cricket',
    });
  });
});
