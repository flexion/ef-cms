import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsPetitionerInformation = test => {
  return it('docket clerk edits petitioner information', async () => {
    const contactPrimary = contactPrimaryFromState(test);

    expect(test.getState('caseDetail.status')).not.toBe(CASE_STATUS_TYPES.new);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'Bob',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'Bob Additional Name',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(contactPrimaryFromState(test).additionalName).toBe(
      'Bob Additional Name',
    );

    expect(contactPrimaryFromState(test).name).toBe('Bob');

    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('petitioner');
  });
};
