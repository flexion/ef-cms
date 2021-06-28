import {
  CASE_STATUS_TYPES,
  PARTY_VIEW_TABS,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesPetitionerFromCase = integrationTest => {
  return it('docket clerk removes petitioner', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    const contactPrimaryContactId =
      contactPrimaryFromState(integrationTest).contactId;

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimaryContactId,
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

    expect(
      getPetitionerById(
        integrationTest.getState('caseDetail'),
        contactPrimaryContactId,
      ),
    ).toBeUndefined();

    expect(integrationTest.getState('alertSuccess.message')).toBe(
      'Petitioner successfully removed.',
    );
    expect(
      integrationTest.getState('currentViewMetadata.caseDetail.partyViewTab'),
    ).toBe(PARTY_VIEW_TABS.petitionersAndCounsel);
  });
};
