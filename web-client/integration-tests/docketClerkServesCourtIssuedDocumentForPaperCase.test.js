import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest } from './helpers';

// docketClerk
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocumentWithPaperService } from './journey/docketClerkServesDocumentWithPaperService';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsCaseDetailForCourtIssuedDocketEntry } from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
// petitionsClerk
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  loginAs(test, 'docketclerk');
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test, 0);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test, 0);
  docketClerkServesDocumentWithPaperService(test, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(
    test,
    0,
    CASE_STATUS_TYPES.generalDocket,
  );
});
