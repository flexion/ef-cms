import { adcViewsCounselOnCase } from './journey/adcViewsCounselOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const integrationTest = setupTest();

describe('adc views counsel on case', () => {
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

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'adc@example.com');
  adcViewsCounselOnCase(integrationTest);
});
