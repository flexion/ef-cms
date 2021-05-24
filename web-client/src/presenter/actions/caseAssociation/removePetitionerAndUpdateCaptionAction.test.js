import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removePetitionerAndUpdateCaptionAction } from './removePetitionerAndUpdateCaptionAction';
import { runAction } from 'cerebral/test';

describe('removePetitionerAndUpdateCaptionAction', () => {
  let successStub;

  const mockContact = {
    address1: '123 cat lane',
    contactId: 'b3d03c56-6c5a-4623-9857-40dafd260560',
    name: 'Selena Kyle',
  };

  const form = {
    contact: mockContact,
  };
  const mockDocketNumber = '123-20';

  const caseCaptionToUpdate = 'A test caption';

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should set the success message of `Petitioner removed.` when a petitioner is removed form the case', async () => {
    const { output } = await runAction(removePetitionerAndUpdateCaptionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          petitioners: [
            {
              contactId: mockContact.contactId,
              contactType: CONTACT_TYPES.otherPetitioner,
            },
          ],
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(output.alertSuccess.message).toBe('Petitioner removed.');
    expect(output.tab).toBe('caseInfo');
  });

  it('should set the success message of `Intervenor removed.` when an intervenor is removed form the case', async () => {
    const { output } = await runAction(removePetitionerAndUpdateCaptionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          petitioners: [
            {
              contactId: mockContact.contactId,
              contactType: CONTACT_TYPES.intervenor,
            },
          ],
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(output.alertSuccess.message).toBe('Intervenor removed.');
    expect(output.tab).toBe('caseInfo');
  });

  it('should make a call to remove the petitioner from the case', async () => {
    await runAction(removePetitionerAndUpdateCaptionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          petitioners: [
            {
              contactId: mockContact.contactId,
              contactType: CONTACT_TYPES.intervenor,
            },
          ],
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .removePetitionerAndUpdateCaptionInteractor.mock.calls[0][1],
    ).toMatchObject({
      contactId: mockContact.contactId,
      docketNumber: mockDocketNumber,
    });
  });
});
