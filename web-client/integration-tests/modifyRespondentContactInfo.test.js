import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { respondentUpdatesAddress } from './journey/respondentUpdatesAddress';
import { respondentViewsCaseDetailNoticeOfChangeOfAddress } from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

const integrationTest = setupTest();

describe('Modify Respondent Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  integrationTest.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(integrationTest, 'petitioner@example.com');

    it(`create case #${i} and associate a respondent`, async () => {
      caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.createdDocketNumbers.push(caseDetail.docketNumber);
    });

    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkAddsRespondentsToCase(integrationTest);
  }

  it('wait for ES index', async () => {
    // waiting for the respondent to be associated with the newly created cases
    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  respondentUpdatesAddress(integrationTest);

  it('wait for ES index', async () => {
    // waiting for the associated cases to be updated, and THEN an index
    await refreshElasticsearchIndex(5000);
  });

  for (let i = 0; i < 3; i++) {
    respondentViewsCaseDetailNoticeOfChangeOfAddress(integrationTest, i);
  }
});
