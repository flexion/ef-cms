import {
  CreatedCaseType,
  FileUploadProgressType,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressType>;
}>) => {
  const petitionMetadata: CreatedCaseType = get(state.form);
  const { fileUploadProgressMap } = props;
  let caseDetail: RawCase;

  try {
    const {
      applicationForWaiverOfFilingFeeFileId,
      attachmentToPetitionFileIds,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    } = await applicationContext
      .getUseCases()
      .generateDocumentIds(applicationContext, {
        applicationForWaiverOfFilingFeeUploadProgress:
          fileUploadProgressMap.applicationForWaiverOfFilingFee,
        attachmentToPetitionUploadProgress: [
          fileUploadProgressMap.attachmentToPetition,
        ],
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        requestForPlaceOfTrialUploadProgress:
          fileUploadProgressMap.requestForPlaceOfTrial,
        stinUploadProgress: fileUploadProgressMap.stin,
      });

    caseDetail = await applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeFileId,
        attachmentToPetitionFileId: attachmentToPetitionFileIds[0],
        corporateDisclosureFileId,
        petitionFileId,
        petitionMetadata,
        requestForPlaceOfTrialFileId,
        stinFileId,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
