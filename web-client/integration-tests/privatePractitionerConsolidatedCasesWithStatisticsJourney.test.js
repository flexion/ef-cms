import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { privatePractitionerViewsOpenConsolidatedCases } from './journey/privatePractitionerViewsOpenConsolidatedCases';

const integrationTest = setupTest();

describe('private practitioner views consolidated cases with statistics (integrationTest for bug 8473)', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const createdDocketNumbers = [];

  for (let i = 0; i < 2; i++) {
    loginAs(integrationTest, 'privatePractitioner@example.com');
    it(`Create test case #${i}`, async () => {
      const caseDetail = await uploadPetition(
        integrationTest,
        {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        'privatePractitioner@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(integrationTest.docketNumber);
      integrationTest.leadDocketNumber = createdDocketNumbers[0];
    });

    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkEditsPetitionInQCIRSNotice(integrationTest);
    petitionsClerkServesElectronicCaseToIrs(integrationTest);

    loginAs(integrationTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(integrationTest);
  }

  docketClerkOpensCaseConsolidateModal(integrationTest);
  docketClerkSearchesForCaseToConsolidateWith(integrationTest);
  docketClerkConsolidatesCases(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenConsolidatedCases(integrationTest);
});
