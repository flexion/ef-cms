import { runCompute } from 'cerebral/test';

import { caseDetailEditHelper } from './caseDetailEditHelper';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/contacts/PetitionContact';

describe('case detail edit computed', () => {
  it('sets partyTypes from constants ', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.partyTypes).toBeDefined();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is conservator', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.conservator,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is corporation', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is custodian', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.custodian,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is donor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.donor,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is estate', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.estate,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estateWithoutExecutor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.estateWithoutExecutor,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is guardian', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.guardian,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is nextFriendForIncompetentPerson', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is nextFriendForMinor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.nextFriendForMinor,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipAsTaxMattersPartner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipBBA', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.partnershipBBA,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipOtherThanTaxMatters', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is petitioner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerDeceasedSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is survivingSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.survivingSpouse,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is transferee', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.transferee,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is trust', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.trust,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showOwnershipDisclosureStatement true, sets document id if partyType is corporation', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Ownership Disclosure Statement',
            },
          ],
          partyType: PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeTruthy();
    expect(result.ownershipDisclosureStatementDocumentId).toEqual(
      '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    );
  });

  it('sets showOwnershipDisclosureStatement false if partyType is corporation but there is no document for ODS', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Petition',
            },
          ],
          partyType: PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeFalsy();
  });

  it('sets showOwnershipDisclosureStatement false if partyType is petitioner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeFalsy();
  });
});
