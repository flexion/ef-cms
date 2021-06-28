import { chambersUserViewsDashboard } from './journey/chambersUserViewsDashboard';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';

const integrationTest = setupTest();

describe('Chambers dashboard', () => {
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

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesMessageToChambers(integrationTest);

  loginAs(integrationTest, 'colvinsChambers@example.com');
  chambersUserViewsDashboard(integrationTest);
});
