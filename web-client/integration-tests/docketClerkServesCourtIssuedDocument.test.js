import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCancelsAddDocketEntryFromOrder } from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsSavedCourtIssuedDocketEntryInProgress } from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(integrationTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCase(integrationTest, fakeFile);

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
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to Show Cause',
    eventCode: 'OSC',
    expectedDocumentType: 'Order to Show Cause',
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest, 6);
  petitionsClerkViewsDraftOrder(integrationTest, 0);
  petitionsClerkPrioritizesCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkViewsDraftOrder(integrationTest, 1);
  docketClerkCancelsAddDocketEntryFromOrder(integrationTest, 1);
  docketClerkViewsDraftOrder(integrationTest, 1);
  docketClerkSignsOrder(integrationTest, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(integrationTest, 1);
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(integrationTest, 1);
  docketClerkServesDocument(integrationTest, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 1);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(integrationTest, 1);

  docketClerkViewsDraftOrder(integrationTest, 2);
  docketClerkSignsOrder(integrationTest, 2);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 2);
  docketClerkServesDocumentFromCaseDetailDocumentView(integrationTest);
  docketClerkViewsCaseDetailDocumentView(integrationTest);
});
