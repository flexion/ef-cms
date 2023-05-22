import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkNavigatesToEditDocketEntryCertificateOfService } from './journey/docketClerkNavigatesToEditDocketEntryCertificateOfService';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerFilesANonstardardDDocumentForCase } from './journey/petitionerFilesANonstardardDDocumentForCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe("Docket Clerk Edits a Docket Entry's Nonstandard D Metadata", () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const { docketEntries, docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
    cerebralTest.previousDocumentId = docketEntries[0].docketEntryId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesANonstardardDDocumentForCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkChecksDocketEntryEditLink(cerebralTest);
  docketClerkQCsDocketEntry(cerebralTest);
  docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });

  docketClerkNavigatesToEditDocketEntryCertificateOfService(cerebralTest, 4);
});
