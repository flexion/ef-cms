import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrderWithPaperService } from './journey/docketClerkServesOrderWithPaperService';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesOrderWithPaperService(integrationTest, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(
    integrationTest,
    0,
    CASE_STATUS_TYPES.generalDocket,
  );
});
