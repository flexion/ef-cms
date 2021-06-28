import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsPetitionerInformation = integrationTest => {
  return it('docket clerk edits petitioner information', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    expect(integrationTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'Bob',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'Bob Additional Name',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(contactPrimaryFromState(integrationTest).additionalName).toEqual(
      'Bob Additional Name',
    );

    expect(contactPrimaryFromState(integrationTest).name).toEqual('Bob');

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('parties');
  });
};
