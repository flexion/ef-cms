import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { privatePractitionerViewsOpenConsolidatedCases } from './journey/privatePractitionerViewsOpenConsolidatedCases';

const test = setupTest();

describe('private practitioner views consolidated cases with statistics (test for bug 8473)', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const createdDocketNumbers = [];

  for (let i = 0; i < 2; i++) {
    loginAs(test, 'privatePractitioner@example.com');
    it(`Create test case #${i}`, async () => {
      const caseDetail = await uploadPetition(
        test,
        {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        'privatePractitioner@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      test.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(test.docketNumber);
      test.leadDocketNumber = createdDocketNumbers[0];
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkEditsPetitionInQCIRSNotice(test);
    petitionsClerkServesElectronicCaseToIrs(test);

    loginAs(test, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(test);
  }

  docketClerkOpensCaseConsolidateModal(test);
  docketClerkSearchesForCaseToConsolidateWith(test);
  docketClerkConsolidatesCases(test);

  loginAs(test, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenConsolidatedCases(test);
});
