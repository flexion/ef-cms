import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsServiceIndicatorForPetitioner = (
  integrationTest,
  expectedServiceIndicator = null,
) => {
  return it('docket clerk edits service indicator for a petitioner', async () => {
    let contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('form.contact.serviceIndicator')).toEqual(
      expectedServiceIndicator || SERVICE_INDICATOR_TYPES.SI_NONE,
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    contactPrimary = contactPrimaryFromState(integrationTest);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
