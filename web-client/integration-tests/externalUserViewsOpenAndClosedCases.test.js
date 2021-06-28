import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { irsPractitionerViewsOpenAndClosedCases } from './journey/irsPractitionerViewsOpenAndClosedCases';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsOpenAndClosedCases } from './journey/petitionerViewsOpenAndClosedCases';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { privatePractitionerViewsOpenAndClosedCases } from './journey/privatePractitionerViewsOpenAndClosedCases';

const integrationTest = setupTest();

describe('external user views open and closed cases', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('login as a petitioner and create the case to close', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest, true);
  petitionsClerkAddsRespondentsToCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsOpenAndClosedCases(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenAndClosedCases(integrationTest);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  irsPractitionerViewsOpenAndClosedCases(integrationTest);
});
