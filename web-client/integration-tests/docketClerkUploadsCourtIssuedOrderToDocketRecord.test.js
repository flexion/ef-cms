import { docketClerkAddsDocketEntryForNoticeFromDraft } from './journey/docketClerkAddsDocketEntryForNoticeFromDraft';
import { docketClerkAddsDocketEntryFromDraft } from './journey/docketClerkAddsDocketEntryFromDraft';
import { docketClerkEditsAnUploadedCourtIssuedDocument } from './journey/docketClerkEditsAnUploadedCourtIssuedDocument';
import { docketClerkEditsSignedUploadedCourtIssuedDocument } from './journey/docketClerkEditsSignedUploadedCourtIssuedDocument';
import { docketClerkRemovesSignatureFromUploadedCourtIssuedDocument } from './journey/docketClerkRemovesSignatureFromUploadedCourtIssuedDocument';
import { docketClerkSignsUploadedCourtIssuedDocument } from './journey/docketClerkSignsUploadedCourtIssuedDocument';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsDraftOrder } from './journey/petitionsClerkViewsDraftOrder';

const integrationTest = setupTest();

describe('Docket Clerk Uploads Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    integrationTest.draftOrders = [];
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(integrationTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(integrationTest, fakeFile);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest, 4);
  petitionsClerkViewsDraftOrder(integrationTest, 0);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkEditsAnUploadedCourtIssuedDocument(integrationTest, fakeFile, 0);
  docketClerkSignsUploadedCourtIssuedDocument(integrationTest);
  docketClerkEditsSignedUploadedCourtIssuedDocument(integrationTest, fakeFile);
  docketClerkSignsUploadedCourtIssuedDocument(integrationTest);
  docketClerkRemovesSignatureFromUploadedCourtIssuedDocument(integrationTest);
  docketClerkAddsDocketEntryFromDraft(integrationTest, 0);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(integrationTest, { documentCount: 3 });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(integrationTest, fakeFile);
  docketClerkViewsDraftOrder(integrationTest, 2);
  docketClerkAddsDocketEntryForNoticeFromDraft(integrationTest, 2);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsCaseDetail(integrationTest, { documentCount: 4 });
});
