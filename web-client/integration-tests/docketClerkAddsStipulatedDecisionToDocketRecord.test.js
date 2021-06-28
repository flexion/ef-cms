import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsStipulatedDecisionDocketEntryFromOrder } from './journey/docketClerkAddsStipulatedDecisionDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Adds Stipulated Decision to Docket Record', () => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsStipulatedDecisionDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 0);

  loginAs(integrationTest, 'petitioner@example.com');
  it('petitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(true);
  });

  loginAs(integrationTest, 'privatePractitioner@example.com');
  it('unassociated privatePractitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(false);
  });
});
