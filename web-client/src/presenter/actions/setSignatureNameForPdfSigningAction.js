import { state } from 'cerebral';

/**
 * sets the name to be used for signing a pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the getChiefJudgeNameForSigning method we will use to get the chief judge's name
 * @param {object} providers.store the cerebral store object used for setting pdfForSigning.nameForSigning
 */
export const setSignatureNameForPdfSigningAction = async ({
  applicationContext,
  store,
}) => {
  const user = applicationContext.getCurrentUser();
  let nameForPdfSigning;
  let nameForSigningLine2;

  if (user.section.includes('Chambers')) {
    const judgeUser = await applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor({
        applicationContext,
        user,
      });
    nameForPdfSigning = judgeUser.judgeFullName;
    nameForSigningLine2 = judgeUser.judgeTitle;
  } else {
    const name = applicationContext.getChiefJudgeNameForSigning();
    nameForPdfSigning = name;
    nameForSigningLine2 = 'Chief Judge';
  }
  store.set(state.pdfForSigning.nameForSigning, nameForPdfSigning);
  store.set(state.pdfForSigning.nameForSigningLine2, nameForSigningLine2);
};
