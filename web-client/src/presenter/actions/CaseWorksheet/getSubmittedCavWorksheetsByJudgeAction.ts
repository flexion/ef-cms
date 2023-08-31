export const getSubmittedCavWorksheetsByJudgeAction = async ({
  applicationContext,
}: ActionProps<{
  selectedPage: number;
}>) => {
  const worksheets = await applicationContext
    .getUseCases()
    .getCaseWorksheetsForJudgeInteractor(applicationContext);

  console.log('worksheets', worksheets);

  return {
    worksheets,
  };
};
