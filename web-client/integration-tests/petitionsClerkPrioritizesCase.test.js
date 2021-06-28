import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

const integrationTest = setupTest();

describe('Prioritize a Case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile, 'Lubbock, Texas');
  petitionsClerkPrioritizesCase(integrationTest);
  petitionsClerkVerifyEligibleCase(integrationTest);
  petitionsClerkUnprioritizesCase(integrationTest);
  petitionsClerkVerifyNotEligibleCase(integrationTest);
});
