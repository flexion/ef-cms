import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { selectWorkItemSequence } from '../sequences/selectWorkItemSequence';

describe('selectWorkItemSequence', () => {
  let integrationTest;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      selectWorkItemSequence,
    };
    integrationTest = CerebralTest(presenter);
  });
  it('should add a work item to the selectedWorkItems state if it does not already exist', async () => {
    integrationTest.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await integrationTest.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: '123',
      },
    });
    expect(integrationTest.getState('selectedWorkItems')).toMatchObject([
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
      {
        workItemId: '123',
      },
    ]);
  });

  it('should remove a work item that was already selected from the selectedWorkItems state', async () => {
    integrationTest.setState('selectedWorkItems', [
      {
        workItemId: 'abc',
      },
      {
        workItemId: 'gg',
      },
    ]);
    await integrationTest.runSequence('selectWorkItemSequence', {
      workItem: {
        workItemId: 'gg',
      },
    });
    expect(integrationTest.getState('selectedWorkItems')).toMatchObject([
      {
        workItemId: 'abc',
      },
    ]);
  });
});
