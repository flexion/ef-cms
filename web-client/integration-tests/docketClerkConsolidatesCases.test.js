import { loginAs, setupTest, uploadPetition } from './helpers';
// docketclerk
import { docketClerkConsolidatesCaseThatCannotBeConsolidated } from './journey/docketClerkConsolidatesCaseThatCannotBeConsolidated';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUnconsolidatesCase } from './journey/docketClerkUnconsolidatesCase';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
// petitioner
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const integrationTest = setupTest();
const trialLocation = `Boise, Idaho, ${Date.now()}`;

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

describe('Case Consolidation Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(integrationTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = integrationTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');

  it('login as a petitioner and create a case that cannot be consolidated with the lead case', async () => {
    //not passing in overrides to preferredTrialCity to ensure case cannot be consolidated
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumberDifferentPlaceOfTrial = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);
  docketClerkOpensCaseConsolidateModal(integrationTest);
  docketClerkSearchesForCaseToConsolidateWith(integrationTest);
  docketClerkConsolidatesCaseThatCannotBeConsolidated(integrationTest);

  it('login as a petitioner and create the case to consolidate with', async () => {
    integrationTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(integrationTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);
  docketClerkOpensCaseConsolidateModal(integrationTest);
  docketClerkSearchesForCaseToConsolidateWith(integrationTest);
  docketClerkConsolidatesCases(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsDashboard(integrationTest);
  petitionerVerifiesConsolidatedCases(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUnconsolidatesCase(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerViewsDashboard(integrationTest);
  petitionerVerifiesUnconsolidatedCases(integrationTest);
});
