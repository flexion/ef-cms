import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase.js';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase.js';
import { fakeFile, loginAs, setupTest } from './helpers';
import { getOtherFilers } from '../../shared/src/business/entities/cases/Case';

const integrationTest = setupTest();

describe('an external user files a document for their legacy case', () => {
  const seededDocketNumber = '999-15';

  beforeAll(() => {
    jest.setTimeout(30000);
    integrationTest.docketNumber = seededDocketNumber;
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(integrationTest);
  externalUserFilesDocumentForOwnedCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(integrationTest);
  externalUserFilesDocumentForOwnedCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(integrationTest);
  externalUserFilesDocumentForOwnedCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  it('verifies otherFiler parties receive paper service when serviceIndicator is set to paper', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const otherFilers = getOtherFilers(integrationTest.getState('caseDetail'));
    const docketEntries = integrationTest.getState('caseDetail.docketEntries');
    const lastServedDocument = docketEntries.pop();

    const isOtherFilerServed = lastServedDocument.servedParties.find(
      p => p.name === otherFilers[0].name && p.email === otherFilers[0].email,
    );

    expect(isOtherFilerServed).toBeTruthy();
  });
});
