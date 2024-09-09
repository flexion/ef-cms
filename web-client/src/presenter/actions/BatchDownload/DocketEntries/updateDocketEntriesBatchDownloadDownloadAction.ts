import { AsyncZipDeflate, Zip, unzip, zipSync } from 'fflate';
import { state } from '@web-client/presenter/app.cerebral';

const mergeZipFiles = async zipUrls => {
  if (zipUrls.length === 0) {
    console.error('No URLs provided.');
    return;
  }

  const allFiles = {};

  // Fetch each ZIP file from the URLs
  for (let i = 0; i < zipUrls.length; i++) {
    const url = zipUrls[i];
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch ${url}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      unzip(new Uint8Array(arrayBuffer), (err, contents) => {
        if (err) {
          console.error('Error unzipping file:', err);
          return;
        }

        // Merge contents with unique names to avoid filename conflicts
        Object.keys(contents).forEach(filename => {
          const newFilename = `${i}_${filename}`; // Add an index to avoid filename conflicts
          allFiles[newFilename] = contents[filename];
        });

        // After processing all files, create the new ZIP file
        if (
          Object.keys(allFiles).length ===
          zipUrls.length * Object.keys(contents).length
        ) {
          const newZip = zipSync(allFiles);
          const blob = new Blob([newZip], { type: 'application/zip' });
          const downloadUr = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUr;
          a.download = 'merged.zip';
          a.click();
        }
      });
    } catch (err) {
      console.error(`Error fetching or processing ${url}:`, err);
    }
  }
};

export const updateDocketEntriesBatchDownloadDownloadAction = async ({
  get,
  props,
  store,
}) => {
  const { index, totalNumberOfBatches, url, uuid } = props;

  const docketEtriesBatchDownload = get(state.docketEtriesBatchDownload);

  docketEtriesBatchDownload[uuid] = [
    ...(docketEtriesBatchDownload[uuid] || []),
    { index, url },
  ];

  store.set(state.docketEtriesBatchDownload, docketEtriesBatchDownload);

  // Wait until all batches are downloaded before merging
  if (docketEtriesBatchDownload[uuid].length !== totalNumberOfBatches) return;

  console.log(
    'docketEtriesBatchDownload[uuid]',
    docketEtriesBatchDownload[uuid],
  );

  // Merge the ZIP files from the URLs
  const results = await mergeZipFiles(
    docketEtriesBatchDownload[uuid].map(x => x.url),
  );
  console.log('results', results);

  // Cr
};
