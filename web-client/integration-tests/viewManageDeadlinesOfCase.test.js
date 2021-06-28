import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkEditsCaseDeadline } from './journey/petitionsClerkEditsCaseDeadline';
import { petitionsClerkViewCaseDeadline } from './journey/petitionsClerkViewCaseDeadline';
import { petitionsClerkViewsCaseWithNoDeadlines } from './journey/petitionsClerkViewsCaseWithNoDeadlines';
import { petitionsClerkViewsDeadlineReportForSingleCase } from './journey/petitionsClerkViewsDeadlineReportForSingleCase';

const integrationTest = setupTest();

describe('View and manage the deadlines of a case', () => {
  const randomDay = `0${Math.floor(Math.random() * 9) + 1}`;
  const randomMonth = `0${Math.floor(Math.random() * 9) + 1}`;
  const randomYear = `200${Math.floor(Math.random() * 9) + 1}`;

  const overrides = {
    day: randomDay,
    month: randomMonth,
    year: randomYear,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  describe('Create a case', () => {
    loginAs(integrationTest, 'petitioner@example.com');
    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.docketNumber = caseDetail.docketNumber;
    });
  });

  describe('View a case with no deadlines', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(integrationTest);
  });

  describe('Create 2 case deadlines', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesACaseDeadline(integrationTest, overrides);
    petitionsClerkCreatesACaseDeadline(integrationTest, overrides);
  });

  describe('View case deadline list on case', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkViewCaseDeadline(integrationTest);
  });

  describe('View the deadlines report', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkViewsDeadlineReportForSingleCase(integrationTest, overrides);
  });

  describe('Edit a case deadline on case', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkEditsCaseDeadline(integrationTest);
  });

  describe('Delete case deadlines on case', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkDeletesCaseDeadline(integrationTest);
    petitionsClerkDeletesCaseDeadline(integrationTest);
  });

  describe('View a case with no deadlines', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkViewsCaseWithNoDeadlines(integrationTest);
  });
});
