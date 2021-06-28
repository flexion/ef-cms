import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesPetitionFromMessageDetail } from './journey/petitionsClerk1ServesPetitionFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Petitions Clerk Serves Paper Petition From Message Detail & Document View', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(integrationTest, fakeFile);
  createNewMessageOnCase(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(integrationTest);
  petitionsClerk1ViewsMessageDetail(integrationTest);
  petitionsClerk1ServesPetitionFromMessageDetail(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(integrationTest);
});
