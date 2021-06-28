import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { userNavigatesToCreateCaseConfirmation } from './journey/userNavigatesToCreateCaseConfirmation';

const integrationTest = setupTest();

describe('Case Confirmation', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitionsclerk then has access to case confirmation', () => {
    loginAs(integrationTest, 'petitioner@example.com');
    petitionerChoosesProcedureType(integrationTest);
    petitionerChoosesCaseType(integrationTest);
    petitionerCreatesNewCase(integrationTest, fakeFile);
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(integrationTest);
    userNavigatesToCreateCaseConfirmation(integrationTest);
  });

  describe('Petitioner creates a case / Petitionsclerk Sends to Holding Queue / Petitioner then has access to case confirmation', () => {
    loginAs(integrationTest, 'petitioner@example.com');
    petitionerChoosesProcedureType(integrationTest);
    petitionerChoosesCaseType(integrationTest);
    petitionerCreatesNewCase(integrationTest, fakeFile);
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(integrationTest);
    loginAs(integrationTest, 'petitioner@example.com');
    userNavigatesToCreateCaseConfirmation(integrationTest);
  });

  describe('Petitionsclerk creates a case then serves case then has access to case confirmation', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCase(integrationTest, fakeFile);
    userNavigatesToCreateCaseConfirmation(integrationTest);
  });
});
