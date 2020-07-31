import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { presenter } from '../presenter-mock';

describe('chooseWorkQueueSequence', () => {
  let test;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({ section: 'petitions' });
    applicationContext
      .getUseCases()
      .getDocumentQCInboxForSectionInteractor.mockReturnValue([
        { document: { isFileAttached: true } },
      ]);
    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({});
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      chooseWorkQueueSequence,
    };
    test = CerebralTest(presenter);
  });

  it('should set the workQueueToDisplay to match the props passed in', async () => {
    test.setState('workQueueToDisplay', null);
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workItems: [],
    });
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
    });
    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor,
    ).toBeCalled();
  });
});
