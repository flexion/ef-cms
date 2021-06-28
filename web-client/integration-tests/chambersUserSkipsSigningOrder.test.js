import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserSkipSigningOrder } from './journey/chambersUserSkipSigningOrder';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('chambers user skips signing an order', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'colvinsChambers@example.com');

  chambersUserViewsCaseDetail(integrationTest, 2);
  chambersUserViewsDraftDocuments(integrationTest);
  chambersUserAddsOrderToCase(integrationTest);
  chambersUserSkipSigningOrder(integrationTest);
});
