import { fakeFile, loginAs, setupTest } from './helpers';
import { irsSuperuserAdvancedSearchForCase } from './journey/irsSuperuserAdvancedSearchForCase';
import { irsSuperuserAdvancedSearchForCaseDocketNumber } from './journey/irsSuperuserAdvancedSearchForCaseDocketNumber';
import { irsSuperuserSearchForCase } from './journey/irsSuperuserSearchForCase';
import { irsSuperuserSearchForUnservedCase } from './journey/irsSuperuserSearchForUnservedCase';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const integrationTest = setupTest();

describe('irsSuperuser case search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'irsSuperuser@example.com');
  irsSuperuserSearchForCase(integrationTest);
  irsSuperuserAdvancedSearchForCase(integrationTest);
  irsSuperuserAdvancedSearchForCaseDocketNumber(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'irsSuperuser@example.com');
  irsSuperuserSearchForUnservedCase(integrationTest);
});
