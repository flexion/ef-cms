import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkBulkAssignsCases } from './journey/petitionsClerkBulkAssignsCases';
import { petitionsClerkGetsMyDocumentQCInboxCount } from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import { petitionsClerkGetsSectionDocumentQCInboxCount } from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import { petitionsClerkVerifiesAssignedWorkItem } from './journey/petitionsClerkVerifiesAssignedWorkItem';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';

const integrationTest = setupTest();

describe('Petitions Clerk Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const createdCases = [];

  const caseCreationCount = 3;

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(integrationTest, true);
  petitionsClerkViewsMyDocumentQC(integrationTest, true);

  loginAs(integrationTest, 'petitioner@example.com');

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      createdCases.push(caseDetail);
    });
  }

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsSectionDocumentQC(integrationTest);
  petitionsClerkGetsSectionDocumentQCInboxCount(
    integrationTest,
    caseCreationCount,
  );
  petitionsClerkBulkAssignsCases(integrationTest, createdCases);
  petitionsClerkViewsMyDocumentQC(integrationTest);
  petitionsClerkGetsMyDocumentQCInboxCount(integrationTest, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(integrationTest, createdCases);
});
