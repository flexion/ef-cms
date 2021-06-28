import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsCaseNote } from './journey/petitionsClerkAddsCaseNote';
import { petitionsClerkDeletesCaseNote } from './journey/petitionsClerkDeletesCaseNote';

const integrationTest = setupTest();

describe('petitions clerk case notes journey', () => {
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
  petitionsClerkAddsCaseNote(integrationTest);
  petitionsClerkDeletesCaseNote(integrationTest);
});
