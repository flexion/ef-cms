import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesDocumentFromMessageDetail } from './journey/petitionsClerk1ServesDocumentFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkClicksCaseDetailTabFromMessageDetail } from './journey/petitionsClerkClicksCaseDetailTabFromMessageDetail';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Petitions Clerk Serves Court Issued Document From Message Detail', () => {
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

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });

  docketClerkViewsDraftOrder(integrationTest, 0);
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  createNewMessageOnCase(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(integrationTest);
  petitionsClerk1ViewsMessageDetail(integrationTest);
  petitionsClerk1ServesDocumentFromMessageDetail(integrationTest);
  petitionsClerkClicksCaseDetailTabFromMessageDetail(integrationTest);
});
