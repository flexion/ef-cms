import { state } from '@web-client/presenter/app.cerebral';

export const openCaseDocumentDownloadUrlAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps<{
  docketEntryId: string;
  docketNumber: string;
  isForIFrame?: boolean;
  isPublic?: boolean;
  useSameTab?: boolean;
}>) => {
  const {
    docketEntryId,
    docketNumber,
    isForIFrame = false,
    isPublic,
    useSameTab,
  } = props;

  let url: string;
  try {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic,
        key: docketEntryId,
      }));
  } catch (err: any) {
    const ERROR: Error = err;
    throw new Error(`Unable to open document. ${ERROR.message}`);
  }

  if (!isForIFrame && !useSameTab) {
    await applicationContext.getUtilities().openUrlInNewTab({ url });
  } else {
    if (isForIFrame) {
      store.set(state.iframeSrc, url);
    } else if (useSameTab) {
      window.location.href = url;
    }
  }
};
