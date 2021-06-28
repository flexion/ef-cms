import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Serves Paper Filed Document From Case Detail Documents View', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(
    integrationTest,
    fakeFile,
  );
  docketClerkServesDocumentFromCaseDetailDocumentView(integrationTest);
  docketClerkViewsCaseDetailDocumentView(integrationTest);
});
