import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkAddsDocketEntryFromOrderWithDate } from './journey/docketClerkAddsDocketEntryFromOrderWithDate';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkConvertsAnOrderToAnOpinion } from './journey/docketClerkConvertsAnOrderToAnOpinion';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryFromOrderTypeA } from './journey/docketClerkEditsDocketEntryFromOrderTypeA';
import { docketClerkEditsDocketEntryFromOrderTypeC } from './journey/docketClerkEditsDocketEntryFromOrderTypeC';
import { docketClerkEditsDocketEntryFromOrderTypeD } from './journey/docketClerkEditsDocketEntryFromOrderTypeD';
import { docketClerkEditsDocketEntryFromOrderTypeE } from './journey/docketClerkEditsDocketEntryFromOrderTypeE';
import { docketClerkEditsDocketEntryFromOrderTypeF } from './journey/docketClerkEditsDocketEntryFromOrderTypeF';
import { docketClerkEditsDocketEntryFromOrderTypeG } from './journey/docketClerkEditsDocketEntryFromOrderTypeG';
import { docketClerkEditsDocketEntryFromOrderTypeH } from './journey/docketClerkEditsDocketEntryFromOrderTypeH';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDocketEntry } from './journey/petitionsClerkViewsDocketEntry';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest, 5);
  petitionsClerkViewsDraftOrder(integrationTest, 0);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeA(integrationTest, 0);
  docketClerkConvertsAnOrderToAnOpinion(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeC(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeD(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeE(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeF(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeG(integrationTest, 0);
  docketClerkEditsDocketEntryFromOrderTypeH(integrationTest, 0);
  docketClerkViewsDraftOrder(integrationTest, 1);
  docketClerkCancelsAddDocketEntryFromOrder(integrationTest, 1);
  docketClerkViewsDraftOrder(integrationTest, 1);
  docketClerkSignsOrder(integrationTest, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(integrationTest, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(integrationTest, 1);
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(integrationTest, 2);
  docketClerkAddsDocketEntryFromOrderWithDate(integrationTest, 2);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsDocketEntry(integrationTest, 1);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(integrationTest, {
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
    documentCount: 5,
  });
});
