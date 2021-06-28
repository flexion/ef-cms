import { adcsSignsProposedStipulatedDecisionFromMessage } from './journey/adcsSignsProposedStipulatedDecisionFromMessage';
import { docketClerkAssignWorkItemToSelf } from './journey/docketClerkAssignWorkItemToSelf';
import { docketClerkCompletesDocketEntryQcAndSendsMessage } from './journey/docketClerkCompletesDocketEntryQcAndSendsMessage';
import { docketClerkCreatesDocketEntryForSignedStipulatedDecision } from './journey/docketClerkCreatesDocketEntryForSignedStipulatedDecision';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { respondentUploadsProposedStipulatedDecision } from './journey/respondentUploadsProposedStipulatedDecision';

const integrationTest = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => {
      return new Promise(resolve => {
        resolve(null);
      });
    },
  },
});

describe('a user signs and serves a stipulated decision', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  respondentUploadsProposedStipulatedDecision(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAssignWorkItemToSelf(integrationTest);
  docketClerkCompletesDocketEntryQcAndSendsMessage(integrationTest);

  loginAs(integrationTest, 'adc@example.com');
  adcsSignsProposedStipulatedDecisionFromMessage(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesDocketEntryForSignedStipulatedDecision(integrationTest);
});
