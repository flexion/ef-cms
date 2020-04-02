import { Case } from '../../shared/src/business/entities/cases/Case';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { MAX_FILE_SIZE_MB } from '../../shared/src/persistence/s3/getUploadPolicy';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { User } from '../../shared/src/business/entities/User';
import { fakeData, fakeFile, loginAs, setupTest } from './helpers';
import { getScannerInterface } from '../../shared/src/persistence/dynamsoft/getScannerMockInterface';
import petitionsClerkAddsScannedBatch from './journey/petitionsClerkAddsScannedBatch';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkCreatesScannedPDF from './journey/petitionsClerkCreatesScannedPDF';
import petitionsClerkDeletesMultipleScannedBatches from './journey/petitionsClerkDeletesMultipleScannedBatches';
import petitionsClerkDeletesScannedBatch from './journey/petitionsClerkDeletesScannedBatch';
import petitionsClerkRescansAddedBatch from './journey/petitionsClerkRescansAddedBatch';
import petitionsClerkSelectsScannerSource from './journey/petitionsClerkSelectsScannerSource';
import petitionsClerkViewsCreateNewCase from './journey/petitionsClerkViewsCreateNewCase';
import petitionsClerkViewsScanView from './journey/petitionsClerkViewsScanView';

const test = setupTest();

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

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCreateNewCase(test);
  petitionsClerkViewsScanView(test);
  petitionsClerkSelectsScannerSource(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesScannedBatch(test);
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesMultipleScannedBatches(test, { numBatches: 2 });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkRescansAddedBatch(test);
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkCreatesScannedPDF(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
});
