import {
  addBatchesForScanning,
  createPDFFromScannedBatches,
  selectScannerSource,
} from './scanHelpers';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFile } from './journey/docketClerkAddsDocketEntryFile';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkSavesAndServesDocketEntry } from './journey/docketClerkSavesAndServesDocketEntry';
import { docketClerkViewsEditDocketRecord } from './journey/docketClerkViewsEditDocketRecord';
import { docketClerkViewsQCInProgress } from './journey/docketClerkViewsQCInProgress';
import { docketClerkViewsSectionQCInProgress } from './journey/docketClerkViewsSectionQCInProgress';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';

const integrationTest = setupTest();

describe('Create Docket Entry From Scans', () => {
  let scannerSourceIndex = 0;
  let scannerSourceName = 'scanner A';

  const { CASE_TYPES_MAP } = applicationContext.getConstants();

  beforeEach(() => {
    jest.setTimeout(30000);

    global.window.localStorage.getItem = key => {
      if (key === 'scannerSourceIndex') {
        return `"${scannerSourceIndex}"`;
      }

      if (key === 'scannerSourceName') {
        return `"${scannerSourceName}"`;
      }

      return null;
    };
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(integrationTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCase(integrationTest, fakeFile, {
    caseType: CASE_TYPES_MAP.cdp,
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsDocketEntryWithoutFile(integrationTest);

  docketClerkViewsQCInProgress(integrationTest, true);
  docketClerkViewsSectionQCInProgress(integrationTest, true);
  docketClerkViewsEditDocketRecord(integrationTest);

  selectScannerSource(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  addBatchesForScanning(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  createPDFFromScannedBatches(integrationTest);

  docketClerkAddsDocketEntryFile(integrationTest, fakeFile);
  docketClerkSavesAndServesDocketEntry(integrationTest);

  docketClerkViewsQCInProgress(integrationTest, false);
  docketClerkViewsSectionQCInProgress(integrationTest, false);
});
