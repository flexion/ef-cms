import { docketClerkCreatesMessageWithCorrespondence } from './journey/docketClerkCreatesMessageWithCorrespondence';
import { docketClerkDeletesCorrespondence } from './journey/docketClerkDeletesCorrespondence';
import { docketClerkViewsMessageWithCorrespondence } from './journey/docketClerkViewsMessageWithCorrespondence';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userAddsCorrespondence } from './journey/userAddsCorrespondence';
import { userDeletesCorrespondence } from './journey/userDeletesCorrespondence';
import { userEditsCorrespondence } from './journey/userEditsCorrespondence';
import { userNavigatesToAddCorrespondence } from './journey/userNavigatesToAddCorrespondence';
import { userNavigatesToEditCorrespondence } from './journey/userNavigatesToEditCorrespondence';

describe('Adds correspondence to a case', () => {
  let caseDetail;

  const integrationTest = setupTest();

  const firstCorrespondenceTitle = 'My first correspondence';
  const secondCorrespondenceTitle = 'My second correspondence';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('create case', async () => {
    caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  userNavigatesToAddCorrespondence(integrationTest, 'DocketClerk');
  userAddsCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  userAddsCorrespondence(
    integrationTest,
    secondCorrespondenceTitle,
    'DocketClerk',
  );
  userNavigatesToEditCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  docketClerkCreatesMessageWithCorrespondence(integrationTest);
  docketClerkViewsMessageWithCorrespondence(integrationTest);
  userNavigatesToEditCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'DocketClerk',
  );
  userEditsCorrespondence(integrationTest, 'DocketClerk');
  docketClerkDeletesCorrespondence(integrationTest, firstCorrespondenceTitle);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  userNavigatesToAddCorrespondence(integrationTest, 'AdmissionsClerk');
  userAddsCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );
  userNavigatesToEditCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );
  userEditsCorrespondence(integrationTest, 'AdmissionsClerk');
  userDeletesCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'AdmissionsClerk',
  );

  loginAs(integrationTest, 'general@example.com');
  userNavigatesToAddCorrespondence(integrationTest, 'General user');
  userAddsCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'General user',
  );
  userNavigatesToEditCorrespondence(
    integrationTest,
    firstCorrespondenceTitle,
    'General user',
  );
  userEditsCorrespondence(integrationTest, 'General user');
  userDeletesCorrespondence(integrationTest, firstCorrespondenceTitle);
});
