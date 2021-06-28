import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';
import { practitionerViewsCaseDetailNoticeOfChangeOfAddress } from './journey/practitionerViewsCaseDetailNoticeOfChangeOfAddress';

const integrationTest = setupTest();

describe('Modify Practitioner Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  integrationTest.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(integrationTest, 'privatePractitioner2@example.com');
    it('login as a practitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(
        integrationTest,
        {},
        'privatePractitioner2@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  it('waits for elasticsearch', async () => {
    await refreshElasticsearchIndex();
  });

  practitionerUpdatesAddress(integrationTest);

  for (let i = 0; i < 3; i++) {
    practitionerViewsCaseDetailNoticeOfChangeOfAddress(integrationTest, i);
  }
});
