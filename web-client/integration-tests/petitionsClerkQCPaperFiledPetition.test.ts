import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkRemovesAndReaddsPetitionFile } from './journey/petitionsClerkRemovesAndReaddsPetitionFile';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving } from './journey/petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest);
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
  petitionsClerkReviewsPetitionAndSavesForLater(cerebralTest);
  petitionsClerkViewsSectionInProgress(cerebralTest);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkRemovesAndReaddsPetitionFile(cerebralTest);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkRemovesAndReaddsPdfFromPetition(cerebralTest);
  petitionsClerkEditsSavedPetition(cerebralTest);
  petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving(cerebralTest);

  it('should be able to serve the case', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
});
