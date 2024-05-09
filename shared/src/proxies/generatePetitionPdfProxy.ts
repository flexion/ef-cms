import { post } from '@shared/proxies/requests';

export const generatePetitionPdfInteractor = (
  applicationContext: IApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    caseType,
    contactPrimary,
    contactSecondary,
    docketNumberWithSuffix,
    noticeIssuedDate,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
    taxYear,
  }: any,
): Promise<{
  fileId: string;
  url: string;
}> => {
  return post({
    applicationContext,
    body: {
      caseCaptionExtension,
      caseTitle,
      caseType,
      contactPrimary,
      contactSecondary,
      docketNumberWithSuffix,
      noticeIssuedDate,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
      taxYear,
    },
    endpoint: '/cases/generate-petition',
  });
};
