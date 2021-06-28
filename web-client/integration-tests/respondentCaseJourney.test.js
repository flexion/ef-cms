import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { respondent1ViewsCaseDetailOfAssociatedCase } from './journey/respondent1ViewsCaseDetailOfAssociatedCase';
import { respondentFilesDocumentForAssociatedCase } from './journey/respondentFilesDocumentForAssociatedCase';
import { respondentFilesFirstIRSDocumentOnCase } from './journey/respondentFilesFirstIRSDocumentOnCase';
import { respondentRequestsAccessToCase } from './journey/respondentRequestsAccessToCase';
import { respondentSearchesForCase } from './journey/respondentSearchesForCase';
import { respondentSearchesForNonexistentCase } from './journey/respondentSearchesForNonexistentCase';
import { respondentViewsCaseDetail } from './journey/respondentViewsCaseDetail';
import { respondentViewsCaseDetailOfAssociatedCase } from './journey/respondentViewsCaseDetailOfAssociatedCase';
import { respondentViewsCaseDetailOfUnassociatedCase } from './journey/respondentViewsCaseDetailOfUnassociatedCase';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

const integrationTest = setupTest();

describe('Respondent requests access to a case', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(integrationTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  respondentSearchesForNonexistentCase(integrationTest);
  respondentViewsDashboard(integrationTest);
  respondentSearchesForCase(integrationTest);
  respondentViewsCaseDetail(integrationTest, false);
  respondentFilesFirstIRSDocumentOnCase(integrationTest, fakeFile);
  respondentViewsDashboard(integrationTest);
  respondentViewsCaseDetailOfAssociatedCase(integrationTest);
  respondentFilesDocumentForAssociatedCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'irsPractitioner1@example.com');
  respondentSearchesForCase(integrationTest);
  respondentViewsCaseDetailOfUnassociatedCase(integrationTest);
  respondentRequestsAccessToCase(integrationTest, fakeFile);
  respondent1ViewsCaseDetailOfAssociatedCase(integrationTest);
  respondentFilesDocumentForAssociatedCase(integrationTest, fakeFile);
});
