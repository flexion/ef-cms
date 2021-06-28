import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryMeta } from './journey/docketClerkEditsDocketEntryMeta';
import { docketClerkEditsDocketEntryMetaCourtIssued } from './journey/docketClerkEditsDocketEntryMetaCourtIssued';
import { docketClerkEditsDocketEntryMetaMinuteEntry } from './journey/docketClerkEditsDocketEntryMetaMinuteEntry';
import { docketClerkEditsDocketEntryMetaWithNewFreeText } from './journey/docketClerkEditsDocketEntryMetaWithNewFreeText';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaCourtIssued';
import { docketClerkNavigatesToEditDocketEntryMetaMinuteEntry } from './journey/docketClerkNavigatesToEditDocketEntryMetaMinuteEntry';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates } from './journey/docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates';
import { docketClerkVerifiesDocketEntryMetaUpdates } from './journey/docketClerkVerifiesDocketEntryMetaUpdates';
import { docketClerkVerifiesDocketEntryMetaUpdatesInEditForm } from './journey/docketClerkVerifiesDocketEntryMetaUpdatesInEditForm';
import { docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry } from './journey/docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry';
import { docketClerkVerifiesEditCourtIssuedNonstandardFields } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFields';
import { docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge } from './journey/docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { irsSuperuserGetsReconciliationReport } from './journey/irsSuperuserGetsReconciliationReport';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionerFilesApplicationToTakeDeposition } from './journey/petitionerFilesApplicationToTakeDeposition';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Meta", () => {
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
  petitionerFilesADocumentForCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(integrationTest);
  docketClerkQCsDocketEntry(integrationTest);
  docketClerkChecksDocketEntryEditLink(integrationTest, { value: true });

  // edit docket entry meta for a minute entry
  docketClerkNavigatesToEditDocketEntryMetaMinuteEntry(integrationTest);
  docketClerkEditsDocketEntryMetaMinuteEntry(integrationTest);
  docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry(integrationTest);
  docketClerkNavigatesToEditDocketEntryMetaMinuteEntry(integrationTest);

  docketClerkNavigatesToEditDocketEntryMeta(integrationTest, 3);
  docketClerkEditsDocketEntryMeta(integrationTest, 3, {
    filedBy: 'Resp. & Petr. Mona Schultz, Brianna Noble',
  });
  docketClerkVerifiesDocketEntryMetaUpdates(integrationTest, 3);
  docketClerkNavigatesToEditDocketEntryMeta(integrationTest, 3);
  docketClerkVerifiesDocketEntryMetaUpdatesInEditForm(integrationTest);

  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 0);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(integrationTest, 4);
  docketClerkEditsDocketEntryMetaCourtIssued(integrationTest, 4);
  docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates(integrationTest, 4);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(integrationTest, 4);
  docketClerkVerifiesEditCourtIssuedNonstandardFields(integrationTest);

  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(integrationTest, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(integrationTest, 1);
  docketClerkServesDocument(integrationTest, 1);
  docketClerkNavigatesToEditDocketEntryMetaCourtIssued(integrationTest, 5);
  docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerFilesApplicationToTakeDeposition(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkNavigatesToEditDocketEntryMeta(integrationTest, 6);
  docketClerkEditsDocketEntryMetaWithNewFreeText(integrationTest, 6);

  irsSuperuserGetsReconciliationReport(integrationTest);
});
