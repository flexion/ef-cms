import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAdvancedSearchForCase } from './journey/petitionsClerkAdvancedSearchForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const integrationTest = setupTest();

describe('petitions clerk case advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);
  petitionsClerkAdvancedSearchForCase(integrationTest);
});
