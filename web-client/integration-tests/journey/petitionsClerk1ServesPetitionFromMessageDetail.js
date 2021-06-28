import { messageDocumentHelper as messageDocumentHelperComputed } from '../../src/presenter/computeds/messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageDocumentHelper = withAppContextDecorator(
  messageDocumentHelperComputed,
);

export const petitionsClerk1ServesPetitionFromMessageDetail =
  integrationTest => {
    return it('petitions clerk 1 serves paper-filed petition from message detail', async () => {
      let helper = runCompute(messageDocumentHelper, {
        state: integrationTest.getState(),
      });

      expect(helper.showServePetitionButton).toBeTruthy();

      await integrationTest.runSequence('gotoPetitionQcSequence', {
        docketNumber: integrationTest.docketNumber,
        redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
      });

      expect(integrationTest.getState('currentPage')).toEqual('PetitionQc');

      await integrationTest.runSequence('saveSavedCaseForLaterSequence');

      expect(integrationTest.getState('currentPage')).toEqual(
        'ReviewSavedPetition',
      );

      await integrationTest.runSequence('openConfirmServeToIrsModalSequence');

      await integrationTest.runSequence('serveCaseToIrsSequence');

      expect(integrationTest.getState('currentPage')).toEqual(
        'PrintPaperPetitionReceipt',
      );

      await integrationTest.runSequence(
        'completePrintPaperPetitionReceiptSequence',
      );

      expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

      helper = runCompute(messageDocumentHelper, {
        state: integrationTest.getState(),
      });

      expect(helper.showServePetitionButton).toBeFalsy();
    });
  };
