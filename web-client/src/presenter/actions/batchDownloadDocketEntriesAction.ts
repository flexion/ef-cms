import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadDocketEntriesAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileId: string;
}>) => {
  const docketEntries = get(state.documentsSelectedForDownload);
  const caseDetail = get(state.caseDetail);
  const clientConnectionId = get(state.clientConnectionId);
  const { caseCaption, docketNumber } = caseDetail;

  try {
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        caseCaption,
        clientConnectionId,
        docketEntries,
        docketNumber,
        printableDocketRecordFileId: props.fileId,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
