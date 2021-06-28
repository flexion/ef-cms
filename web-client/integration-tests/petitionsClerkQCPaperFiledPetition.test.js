import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkRemovesAndReaddsPetitionFile } from './journey/petitionsClerkRemovesAndReaddsPetitionFile';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving } from './journey/petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const integrationTest = setupTest();

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(integrationTest, fakeFile);
  petitionsClerkReviewsPetitionAndSavesForLater(integrationTest);
  petitionsClerkViewsSectionInProgress(integrationTest);
  petitionsClerkEditsSavedPetition(integrationTest);
  petitionsClerkRemovesAndReaddsPetitionFile(integrationTest, fakeFile);
  petitionsClerkEditsSavedPetition(integrationTest);
  petitionsClerkRemovesAndReaddsPdfFromPetition(integrationTest, fakeFile);
  petitionsClerkEditsSavedPetition(integrationTest);
  petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving(
    integrationTest,
    fakeFile,
  );

  it('should be able to serve the case', async () => {
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
  });
});
