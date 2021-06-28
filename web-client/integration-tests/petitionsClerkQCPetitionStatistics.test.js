import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkSelectsFirstPetitionOnMyDocumentQC } from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

const integrationTest = setupTest();

describe('Entry of Statistics in Petition QC', () => {
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
  petitionsClerkEditsPetitionInQCIRSNotice(integrationTest);
});
