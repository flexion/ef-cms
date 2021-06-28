import { associatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/associatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase.js';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase.js';
import { unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument';

describe('External user views legacy sealed documents', () => {
  const seededDocketNumber = '69312-87';
  const integrationTest = setupTest();

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);

    integrationTest.docketNumber = seededDocketNumber;
    integrationTest.docketEntryId = 'b868a8d3-6990-4b6b-9ccd-b04b22f075a0';
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner2@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(integrationTest);

  loginAs(integrationTest, 'petitioner3@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(
    integrationTest,
  );

  loginAs(integrationTest, 'irsPractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(
    integrationTest,
  );

  loginAs(integrationTest, 'privatePractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(
    integrationTest,
  );

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest, true);
  petitionsClerkAddsRespondentsToCase(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(integrationTest);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(integrationTest);
});
