import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkReviewsPetitionAndSavesForLater =
  integrationTest => {
    return it('Petitions Clerk reviews petition and saves for later', async () => {
      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoWorkQueueSequence');
      expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
      await integrationTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      });

      const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

      expect(workQueueToDisplay.queue).toEqual('section');
      expect(workQueueToDisplay.box).toEqual('inbox');

      const inboxQueue = integrationTest.getState('workQueue');
      const inboxWorkItem = inboxQueue.find(
        workItem => workItem.docketNumber === integrationTest.docketNumber,
      );

      expect(inboxWorkItem).toBeTruthy();

      await integrationTest.runSequence('gotoPetitionQcSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      await integrationTest.runSequence('updateFormValueSequence', {
        key: 'hasVerifiedIrsNotice',
        value: false,
      });

      await integrationTest.runSequence('saveSavedCaseForLaterSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      expect(integrationTest.getState('currentPage')).toEqual(
        'ReviewSavedPetition',
      );

      await integrationTest.runSequence('leaveCaseForLaterServiceSequence', {});

      expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    });
  };
