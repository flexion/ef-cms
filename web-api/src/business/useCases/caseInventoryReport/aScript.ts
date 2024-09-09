import { DownloadDocketEntryRequestType } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { createApplicationContext } from '@web-api/applicationContext';
const fs = require('fs');

console.clear();
const applicationContext = createApplicationContext();
const docketNumber = '21959-16';

async function script() {
  applicationContext.getNotificationGateway = () =>
    ({
      sendNotificationToUser: m => console.log('OVERRIDE -> ', m.message),
    }) as any;

  const DOCKET_ENTRIES_FILE = './documentsSelectedForDownload.json';
  let documentsSelectedForDownload: string[] = [];
  // if (!fs.existsSync(DOCKET_ENTRIES_FILE)) {
  //   console.log('FETCHING');
  //   const caseToBatch = await applicationContext
  //     .getPersistenceGateway()
  //     .getCaseByDocketNumber({
  //       applicationContext,
  //       docketNumber,
  //     });

  //   documentsSelectedForDownload.push(
  //     ...caseToBatch.docketEntries.map(de => de.docketEntryId),
  //   );
  //   fs.writeFileSync(
  //     DOCKET_ENTRIES_FILE,
  //     JSON.stringify(documentsSelectedForDownload, null, 2),
  //   );
  // } else {
  console.log('USE CACHE');
  const cache = JSON.parse(fs.readFileSync(DOCKET_ENTRIES_FILE));
  documentsSelectedForDownload.push(...cache);
  // }

  const DATA: DownloadDocketEntryRequestType = {
    clientConnectionId: 'TEST_clientConnectionId',
    docketNumber,
    documentsSelectedForDownload,
    printableDocketRecordFileId: undefined,
  };

  await applicationContext
    .getUseCases()
    .batchDownloadDocketEntriesInteractor(applicationContext, DATA, {} as any);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
script();
