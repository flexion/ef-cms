import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAddsScannedBatch } from './journey/petitionsClerkAddsScannedBatch';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkCreatesScannedPDF } from './journey/petitionsClerkCreatesScannedPDF';
import { petitionsClerkDeletesMultipleScannedBatches } from './journey/petitionsClerkDeletesMultipleScannedBatches';
import { petitionsClerkDeletesScannedBatch } from './journey/petitionsClerkDeletesScannedBatch';
import { petitionsClerkRescansAddedBatch } from './journey/petitionsClerkRescansAddedBatch';
import { petitionsClerkSelectsScannerSource } from './journey/petitionsClerkSelectsScannerSource';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { petitionsClerkViewsCreateNewCase } from './journey/petitionsClerkViewsCreateNewCase';
import { petitionsClerkViewsScanView } from './journey/petitionsClerkViewsScanView';
import { practitionerViewsCaseDetailWithPaperService } from './journey/practitionerViewsCaseDetailWithPaperService';

const integrationTest = setupTest();

describe('Case from Paper Document Scan journey', () => {
  let scannerSourceIndex = 0;
  let scannerSourceName = 'scanner A';

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

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCreateNewCase(integrationTest);
  petitionsClerkViewsScanView(integrationTest);
  petitionsClerkSelectsScannerSource(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesScannedBatch(integrationTest);
  petitionsClerkAddsScannedBatch(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesMultipleScannedBatches(integrationTest, {
    numBatches: 2,
  });
  petitionsClerkAddsScannedBatch(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkRescansAddedBatch(integrationTest);
  petitionsClerkAddsScannedBatch(integrationTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkCreatesScannedPDF(integrationTest);
  petitionsClerkCreatesNewCase(integrationTest, fakeFile, undefined, false);
  petitionsClerkSubmitsPaperCaseToIrs(integrationTest);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  practitionerViewsCaseDetailWithPaperService(integrationTest);
});
