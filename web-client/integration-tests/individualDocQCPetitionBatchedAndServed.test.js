import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkSelectsFirstPetitionOnMyDocumentQC } from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

const integrationTest = setupTest();

describe('INDIVIDUAL DOC QC: Petition Gets Served', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(integrationTest);
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCase(integrationTest, fakeFile);
  petitionerViewsDashboard(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(integrationTest);
  petitionsClerkAssignsWorkItemToSelf(integrationTest);
  petitionsClerkViewsMyDocumentQC(integrationTest);
  petitionsClerkSelectsFirstPetitionOnMyDocumentQC(integrationTest);
  petitionsClerkSubmitsCaseToIrs(integrationTest);
});
