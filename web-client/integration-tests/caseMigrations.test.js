import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { loginAs, setupTest } from './helpers';
import axios from 'axios';

const test = setupTest();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 1000,
});

const firstConsolidatedCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The First Migrated Case',
  caseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  docketNumber: '101-21',
  leadCaseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  preferredTrialCity: 'Washington, District of Columbia',
  status: 'Calendared',
};
const secondConsolidatedCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Second Migrated Case',
  caseId: '116ff947-48cc-4ee5-9d9a-0bc4e0a64ba3',
  docketNumber: '102-21',
  leadCaseId: '384674aa-48b0-4e91-bcb4-915322d4e76b',
  preferredTrialCity: 'Washington, District of Columbia',
  status: 'Calendared',
};

const correspondenceCase = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'The Third Migrated Case',
  caseId: '116ff947-48cc-4ee5-9d9a-0bc4e0a64ba3',
  correspondence: [
    {
      documentId: 'f3662346-c38b-4729-b3cf-6621f78d33ef',
      documentTitle: 'Receipt',
      filingDate: '2014-01-14T09:53:55.513-05:00',
      userId: '337d6ccc-0f5f-447d-a688-a925da37f252',
    },
    {
      documentId: '686211b8-bd2c-4e0b-9381-c66a895cfdfd',
      documentTitle: 'Correspondence',
      filingDate: '2014-01-14T09:53:55.523-05:00',
      userId: '28ca4d90-3c85-4006-8154-46a4b517be1b',
    },
  ],
  docketNumber: '102-22',
  preferredTrialCity: 'Washington, District of Columbia',
  status: 'Calendared',
};

describe('Case journey', () => {
  it('should migrate cases', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      firstConsolidatedCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      secondConsolidatedCase,
    );
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      correspondenceCase,
    );
  });

  loginAs(test, 'docketclerk');

  it('Docketclerk views both consolidated case details', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: firstConsolidatedCase.docketNumber,
    });
    expect(test.getState('caseDetail.consolidatedCases').length).toBe(2);
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: secondConsolidatedCase.docketNumber,
    });
    expect(test.getState('caseDetail.consolidatedCases').length).toBe(2);
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: correspondenceCase.docketNumber,
    });
    expect(test.getState('caseDetail.correspondence').length).toBe(2);
  });
});
