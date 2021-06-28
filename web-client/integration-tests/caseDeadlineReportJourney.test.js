import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkViewsDeadlineReport } from './journey/petitionsClerkViewsDeadlineReport';

const integrationTest = setupTest();

describe('Case deadline report journey', () => {
  const randomDay = `1${Math.floor(Math.random() * 9) + 1}`;
  const randomYear = `200${Math.floor(Math.random() * 9) + 1}`;

  const overrides = {
    day: randomDay,
    month: '01',
    year: randomYear,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
    integrationTest.createdDocketNumbers = [];
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  describe('set up test data - 3 cases with 2 deadlines each', () => {
    for (let i = 0; i < 3; i++) {
      loginAs(integrationTest, 'petitioner@example.com');
      it(`create case ${i}`, async () => {
        const caseDetail = await uploadPetition(integrationTest);
        expect(caseDetail.docketNumber).toBeDefined();
        integrationTest.docketNumber = caseDetail.docketNumber;
        integrationTest.createdDocketNumbers.push(caseDetail.docketNumber);
      });

      loginAs(integrationTest, 'petitionsclerk@example.com');
      petitionsClerkCreatesACaseDeadline(integrationTest, overrides);
      petitionsClerkCreatesACaseDeadline(integrationTest, {
        ...overrides,
        month: '02',
      });
    }
  });

  describe('docket clerk', () => {
    loginAs(integrationTest, 'docketclerk@example.com');
    it('updates associatedJudge for first case to Judge Buch', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.createdDocketNumbers[0],
      });

      await integrationTest.runSequence('openUpdateCaseModalSequence');

      expect(integrationTest.getState('modal.showModal')).toEqual(
        'UpdateCaseModalDialog',
      );

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'caseStatus',
        value: CASE_STATUS_TYPES.submitted,
      });
      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: 'Buch',
      });

      await integrationTest.runSequence('submitUpdateCaseModalSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
        'Buch',
      );

      await refreshElasticsearchIndex();
    });
  });

  describe('View the deadlines report', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReport(integrationTest, overrides);
  });
});
