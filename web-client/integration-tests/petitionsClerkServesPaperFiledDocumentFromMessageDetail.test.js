import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesDocumentFromMessageDetail } from './journey/petitionsClerk1ServesDocumentFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Petitions Clerk Serves Paper Filed Document From Message Detail', () => {
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
  createNewMessageOnCase(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(integrationTest);
  petitionsClerk1ViewsMessageDetail(integrationTest);
  petitionsClerk1ServesDocumentFromMessageDetail(integrationTest);
});
