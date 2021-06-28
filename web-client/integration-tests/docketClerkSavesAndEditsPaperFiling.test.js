import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkEditsPaperFiledDocketEntryFromQC } from './journey/docketClerkEditsPaperFiledDocketEntryFromQC';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();

describe('Docket clerk saves and then edits a paper filing', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
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
  docketClerkEditsPaperFiledDocketEntryFromQC(integrationTest);
});
