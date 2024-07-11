// time node --loader ts-node/esm -r ts-node/register --max-old-space-size=16000 ./other/seed.ts

import { batchWriteAll } from './util/batchWriteAll';
import { client } from './util/client';

const generateCaseEntity = (id: number) => ({
  archivedCorrespondences: [],
  archivedDocketEntries: [],
  associatedJudge: 'Someone',
  blocked: false,
  caseCaption: 'People, Petitioner',
  caseStatusHistory: [],
  caseType: 'Deficiency',
  closedDate: '1993-04-15T00:00:00.000-04:00',
  correspondence: [],
  createdAt: '1992-07-01T00:00:00.000-04:00',
  docketEntries: [],
  docketNumber: `${id}`,
  docketNumberSuffix: 'S',
  docketNumberWithSuffix: `${id}S`,
  entityName: 'Case',
  hasPendingItems: false,
  hearings: [],
  indexedTimestamp: Date.now(),
  initialCaption: 'People, Petitioner',
  initialDocketNumberSuffix: 'S',
  irsPractitioners: [],
  isPaper: true,
  isSealed: false,
  mailingDate: 'See scanned envelope',
  noticeOfAttachments: false,
  noticeOfTrialDate: '2020-11-27T17:08:17.259Z',
  orderDesignatingPlaceOfTrial: false,
  orderForAmendedPetition: false,
  orderForAmendedPetitionAndFilingFee: false,
  orderForCds: false,
  orderForFilingFee: false,
  orderForRatification: false,
  orderToShowCause: false,
  partyType: 'Petitioner',
  petitionPaymentDate: '1992-07-01T00:00:00.000-04:00',
  petitionPaymentMethod: 'N/A',
  petitionPaymentStatus: 'Paid',
  petitioners: [
    {
      address1: '',
      city: '',
      contactId: '1F9B4219-7E32-452D-A50E-0A01D302063D',
      contactType: '',
      country: '',
      countryType: '',
      entityName: '',
      isAddressSealed: false,
      name: 'u',
      phone: 'No Phone',
      postalCode: '',
      sealedAndUnavailable: false,
      serviceIndicator: 'Paper',
      state: 'MD',
    },
  ],
  pk: `case|${id}`,
  preferredTrialCity: 'GG',
  privatePractitioners: [],
  procedureType: 'Small',
  qcCompleteForTrial: {},
  receivedAt: '1992-07-01T00:00:00.000-04:00',
  sk: `case|${id}`,
  sortableDocketNumber: 1992014835,
  statistics: [],
  status: 'Closed',
  userId: '1ecc3419-6ac7-40f4-9c65-58171df09ea1',
});

function generateTextEntity(id: number) {
  return {
    entityName: 'Text',
    pk: `text|${id}`,
    sk: `text|${id}`,
  };
}

const TABLE_NAME = 'cody-test-table';

async function main() {
  const items = new Array(50_000)
    .fill('')
    .map((v, idx) => generateCaseEntity(idx * 1 + 10_000));
  await batchWriteAll(client, TABLE_NAME, items);
  console.log('done');
}

main().catch(error => console.error('Error in main execution:', error));
