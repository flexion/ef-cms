import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkRemovesCaseFromTrial } from './journey/docketClerkRemovesCaseFromTrial';
import { docketClerkViewsSectionInboxHighPriority } from './journey/docketClerkViewsSectionInboxHighPriority';
import { docketClerkViewsSectionInboxNotHighPriority } from './journey/docketClerkViewsSectionInboxNotHighPriority';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

describe('petitioner files document', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Jacksonville, Florida, ${Date.now()}`;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, { trialLocation });
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  it('manually add the case to the session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('openAddToTrialModalSequence');
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
    await wait(1000);
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesDocumentForCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsSectionInboxHighPriority(cerebralTest);
  docketClerkRemovesCaseFromTrial(cerebralTest);

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  docketClerkViewsSectionInboxNotHighPriority(cerebralTest);
});
