import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkNavigatesToEditDocketEntryCertificateOfService } from './journey/docketClerkNavigatesToEditDocketEntryCertificateOfService';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesANonstardardDDocumentForCase } from './journey/petitionerFilesANonstardardDDocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe("Docket Clerk Edits a Docket Entry's Nonstandard D Metadata", () => {
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
    integrationTest.previousDocumentId =
      caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerFilesANonstardardDDocumentForCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(integrationTest);
  docketClerkQCsDocketEntry(integrationTest);
  docketClerkChecksDocketEntryEditLink(integrationTest, { value: true });

  docketClerkNavigatesToEditDocketEntryCertificateOfService(integrationTest, 3);
});
