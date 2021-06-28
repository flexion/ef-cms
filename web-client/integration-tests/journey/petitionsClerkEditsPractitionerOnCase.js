import { EditPetitionerCounselFactory } from '../../../shared/src/business/entities/caseAssociation/EditPetitionerCounselFactory';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = EditPetitionerCounselFactory;

export const petitionsClerkEditsPractitionerOnCase = integrationTest => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(
      integrationTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(2);

    const barNumber = integrationTest.getState(
      'caseDetail.privatePractitioners.1.barNumber',
    );

    await integrationTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);
    const contactSecondary = contactSecondaryFromState(integrationTest);

    expect(
      integrationTest.getState(
        `form.representingMap.${contactPrimary.contactId}`,
      ),
    ).toBeFalsy();
    expect(
      integrationTest.getState(
        `form.representingMap.${contactSecondary.contactId}`,
      ),
    ).toBeTruthy();
    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: false,
    });

    await integrationTest.runSequence('submitEditPetitionerCounselSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      representing: VALIDATION_ERROR_MESSAGES.representing,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    await integrationTest.runSequence('submitEditPetitionerCounselSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(2);

    expect(
      integrationTest.getState(
        'caseDetail.privatePractitioners.1.representing',
      ),
    ).toEqual([contactSecondary.contactId, contactPrimary.contactId]);
  });
};
