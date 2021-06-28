import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPetitionerToCase = (
  integrationTest,
  overrides = {},
) => {
  return it('docket clerk adds new petitioner to case', async () => {
    const petitionersBeforeAdding = integrationTest.getState(
      'caseDetail.petitioners',
    ).length;

    await integrationTest.runSequence('gotoAddPetitionerToCaseSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.contactType',
      value: overrides.contactType || CONTACT_TYPES.otherPetitioner,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: overrides.name || 'A New Petitioner',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'A Petitioner Additional Name',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '6126788888',
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence('setSelectedAddressOnFormSequence', {
      contactId: contactPrimary.contactId,
    });

    const mockUpdatedCaption = 'Something Else';

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.caseCaption',
      value: mockUpdatedCaption,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await integrationTest.runSequence('submitAddPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('caseDetail.petitioners').length).toEqual(
      petitionersBeforeAdding + 1,
    );

    expect(integrationTest.getState('caseDetail.caseCaption')).toEqual(
      mockUpdatedCaption,
    );

    if (overrides.contactType === 'intervenor') {
      integrationTest.intervenorContactId = integrationTest
        .getState('caseDetail.petitioners')
        .find(p => p.contactType === CONTACT_TYPES.intervenor).contactId;
    }
  });
};
