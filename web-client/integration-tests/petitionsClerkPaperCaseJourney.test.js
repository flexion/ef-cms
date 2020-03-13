import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import petitionsClerkCreatesNewCaseAndSavesForLater from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import petitionsClerkEditsAnExistingCaseAndServesCase from './journey/petitionsClerkEditsAnExistingCaseAndServesCase';

const test = setupTest();

describe('Petitions clerk paper case flow', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseAndSavesForLater(test, fakeFile);
  petitionsClerkEditsAnExistingCaseAndServesCase(test);
});
