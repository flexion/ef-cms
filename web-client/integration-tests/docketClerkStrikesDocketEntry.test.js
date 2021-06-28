import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkNavigatesToEditDocketEntryMetaForCourtIssued } from './journey/docketClerkNavigatesToEditDocketEntryMetaForCourtIssued';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkStrikesDocketEntry } from './journey/docketClerkStrikesDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';
import { privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully } from './journey/privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully';
import { privatePractitionerSeesStrickenDocketEntry } from './journey/privatePractitionerSeesStrickenDocketEntry';
import { userSearchesForStrickenDocument } from './journey/userSearchesForStrickenDocument';

const integrationTest = setupTest();
integrationTest.draftOrders = [];
console.error = () => null;

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

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(integrationTest);
  docketClerkQCsDocketEntry(integrationTest);
  docketClerkChecksDocketEntryEditLink(integrationTest, { value: true });

  docketClerkNavigatesToEditDocketEntryMeta(integrationTest, 3);
  docketClerkStrikesDocketEntry(integrationTest, 3);

  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order that is stricken',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 0);
  docketClerkNavigatesToEditDocketEntryMetaForCourtIssued(integrationTest, 4);
  docketClerkStrikesDocketEntry(integrationTest, 4);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  practitionerViewsCaseDetail(integrationTest, false);
  privatePractitionerSeesStrickenDocketEntry(integrationTest, 4);
  privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully(
    integrationTest,
  );
  userSearchesForStrickenDocument(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  userSearchesForStrickenDocument(integrationTest);
});
