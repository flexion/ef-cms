import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesIntervenorFromCase = integrationTest => {
  return it('docket clerk removes intervenor from petitioners', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: integrationTest.intervenorContactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('openRemovePetitionerModalSequence');

    expect(integrationTest.getState('modal.showModal')).toBe(
      'RemovePetitionerModal',
    );

    await integrationTest.runSequence('openRemovePetitionerModalSequence');
    await integrationTest.runSequence(
      'removePetitionerAndUpdateCaptionSequence',
    );

    expect(integrationTest.getState('alertSuccess.message')).toBe(
      'Intervenor successfully removed.',
    );

    expect(
      getPetitionerById(
        integrationTest.getState('caseDetail'),
        integrationTest.intervenorContactId,
      ),
    ).toBeUndefined();
  });
};
