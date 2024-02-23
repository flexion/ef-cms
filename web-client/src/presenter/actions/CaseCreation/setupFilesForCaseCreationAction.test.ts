import { runAction } from 'cerebral/test';
import { setupFilesForCaseCreationAction } from './setupFilesForCaseCreationAction';

describe('setupFilesForCaseCreationAction test', () => {
  it('should get petition documents from state.form and returns document identifying keys', async () => {
    const file = {};
    const result = await runAction(setupFilesForCaseCreationAction, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: file,
          attachmentToPetitionFile: file,
          corporateDisclosureFile: undefined,
          notAFile: file,
          petitionFile: file,
          requestForPlaceOfTrialFile: file,
          stinFile: file,
        },
      },
    });

    expect(result.output.files).toMatchObject({
      applicationForWaiverOfFilingFee: file,
      atp: file,
      corporateDisclosure: undefined,
      petition: file,
      requestForPlaceOfTrial: file,
      stin: file,
    });
  });
});
