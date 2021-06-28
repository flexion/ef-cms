import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkRemovesCaseFromTrial } from './journey/docketClerkRemovesCaseFromTrial';
import { docketClerkViewsSectionInboxHighPriority } from './journey/docketClerkViewsSectionInboxHighPriority';
import { docketClerkViewsSectionInboxNotHighPriority } from './journey/docketClerkViewsSectionInboxNotHighPriority';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const integrationTest = setupTest();

describe('petitioner files document', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  const trialLocation = `Jacksonville, Florida, ${Date.now()}`;

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, { trialLocation });
  docketClerkViewsTrialSessionList(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);
  it('manually add the case to the session', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    await integrationTest.runSequence('openAddToTrialModalSequence');
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.trialSessionId,
    });

    await integrationTest.runSequence('addCaseToTrialSessionSequence');
    await wait(1000);
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerFilesDocumentForCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsSectionInboxHighPriority(integrationTest);
  docketClerkRemovesCaseFromTrial(integrationTest);

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  docketClerkViewsSectionInboxNotHighPriority(integrationTest);
});
