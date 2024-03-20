import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const batchDownloadHelper = (get: Get): any => {
  const fileCount = get(state.batchDownloads.fileCount) || 0;
  const totalFiles = get(state.batchDownloads.totalFiles) || 0;
  const progressDescription =
    get(state.batchDownloads.title) || 'Compressing Case Files';

  const percentComplete = Math.floor((fileCount * 100) / totalFiles) || 0;

  const result = {
    addedFiles: fileCount,
    percentComplete,
    progressDescription,
    totalFiles,
  };
  return result;
};
