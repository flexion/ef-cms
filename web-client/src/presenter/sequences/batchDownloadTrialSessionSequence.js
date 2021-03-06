import { batchDownloadTrialSessionAction } from '../actions/batchDownloadTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { defaultBatchDownloadStateAction } from '../actions/batchDownload/defaultBatchDownloadStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';

export const batchDownloadTrialSessionSequence = [
  clearModalAction,
  startWebSocketConnectionAction,
  {
    error: [setShowModalFactoryAction('WebSocketErrorModal')],
    success: [
      defaultBatchDownloadStateAction,
      batchDownloadTrialSessionAction,
      {
        error: [setShowModalAction],
        success: [],
      },
    ],
  },
];
