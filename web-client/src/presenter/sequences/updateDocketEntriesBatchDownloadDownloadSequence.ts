import { mergeDocketEntriesBatchesAction } from '@web-client/presenter/actions/BatchDownload/DocketEntries/mergeDocketEntriesBatchesAction';
import { singleDocketEntriesBatchCompleteAction } from '@web-client/presenter/actions/BatchDownload/DocketEntries/singleDocketEntriesBatchCompleteAction';

export const updateDocketEntriesBatchDownloadDownloadSequence = [
  singleDocketEntriesBatchCompleteAction,
  {
    batchComplete: [mergeDocketEntriesBatchesAction],
    batchIncomplete: [],
  },
];
