import { state } from '@web-client/presenter/app.cerebral';

export const updatedSetupFilesForCaseCreationAction = ({
  get,
}: ActionProps) => {
  const petitionMetadata = get(state.petitionFormatted);
  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFile,
    corporateDisclosureFile,
    petitionFile,
    primaryDocumentFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = petitionMetadata;

  const files = {
    applicationForWaiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    attachmentToPetition: attachmentToPetitionFile,
    corporateDisclosure: corporateDisclosureFile,
    petition: petitionFile || undefined,
    primary: primaryDocumentFile,
    requestForPlaceOfTrial: requestForPlaceOfTrialFile,
    stin: stinFile,
  };

  return {
    files,
  };
};