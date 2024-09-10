import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { unzipSync, zipSync } from 'fflate';

const mergeZipFiles = async (
  applicationContext: ClientApplicationContext,
  zipUrls,
) => {
  if (zipUrls.length === 0) return;

  const allFiles = {};

  for (let i = 0; i < zipUrls.length; i++) {
    const url = zipUrls[i];
    const response = await applicationContext
      .getHttpClient()
      .get(url, { responseType: 'arraybuffer' });

    const arrayBuffer = response.data;
    const contents = await unzipSync(new Uint8Array(arrayBuffer));
    console.log('contents', contents);

    Object.entries(contents).forEach(([filename, content]) => {
      const dir = filename.split('/');
      const newFilename = `${dir[dir.length - 1]}`; // Add an index to avoid filename conflicts
      allFiles[newFilename] = content;
    });
  }

  const newZip = zipSync(allFiles);
  const blob = new Blob([newZip], { type: 'application/zip' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'merged.zip';
  a.click();
};

export const updateDocketEntriesBatchDownloadCompleteBatchAction = async ({
  get,
  path,
  props,
  store,
}: ActionProps<{
  index: number;
  totalNumberOfBatches: number;
  url: string;
  uuid: string;
}>) => {
  const { index, totalNumberOfBatches, url, uuid } = props;

  const docketEtriesBatchDownload = get(state.docketEtriesBatchDownload);

  docketEtriesBatchDownload[uuid] = [
    ...(docketEtriesBatchDownload[uuid] || []),
    { index, url },
  ];

  store.set(state.docketEtriesBatchDownload, docketEtriesBatchDownload);

  const completedBatchCount = docketEtriesBatchDownload[uuid].length;
  if (completedBatchCount !== totalNumberOfBatches)
    return path.batchIncomplete();

  const tempArray = docketEtriesBatchDownload[uuid].sort(
    (a, b) => a.index - b.index,
  );
  console.log('tempArray', tempArray);
  // await mergeZipFiles(
  //   applicationContext,
  //   tempArray.map(x => x.url),
  // );
  return path.batchComplete();
};
