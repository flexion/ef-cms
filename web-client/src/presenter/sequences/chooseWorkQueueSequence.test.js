import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { presenter } from '../presenter-mock';

describe('chooseWorkQueueSequence', () => {
  const { PETITIONS_SECTION } = applicationContext.getConstants();
  let integrationTest;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: PETITIONS_SECTION,
    });
    applicationContext
      .getUseCases()
      .getDocumentQCInboxForSectionInteractor.mockReturnValue([
        { docketEntry: { isFileAttached: true } },
      ]);
    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({});
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      chooseWorkQueueSequence,
    };
    integrationTest = CerebralTest(presenter);
  });

  it('should set the workQueueToDisplay to match the props passed in', async () => {
    integrationTest.setState('workQueueToDisplay', null);
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workItems: [],
    });
    expect(integrationTest.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
    });
    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor,
    ).toBeCalled();
  });
});
