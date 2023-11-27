import { DocketEntryWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getPendingMotionDocketEntriesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  docketEntries: DocketEntryWithWorksheet[];
}> => {
  const { name } = get(state.judgeUser);

  const { docketEntries } = await applicationContext
    .getUseCases()
    .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      {
        judges: [name],
      },
    );

  return {
    docketEntries,
  };
};