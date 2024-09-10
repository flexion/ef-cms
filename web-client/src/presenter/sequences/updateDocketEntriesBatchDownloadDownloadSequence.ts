import { updateDocketEntriesBatchDownloadCompleteBatchAction } from '@web-client/presenter/actions/BatchDownload/DocketEntries/updateDocketEntriesBatchDownloadCompleteBatchAction';

export const updateDocketEntriesBatchDownloadDownloadSequence = [
  updateDocketEntriesBatchDownloadCompleteBatchAction,
  {
    batchComplete: [],
    batchIncomplete: [],
  },
];
