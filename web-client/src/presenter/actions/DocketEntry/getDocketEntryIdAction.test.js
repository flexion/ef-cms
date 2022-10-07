import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketEntryIdAction } from './getDocketEntryIdAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocketEntryIdAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return state.docketEntryId when the entry is being edited', async () => {
    const mockDocketEntryId = 'a46e6027-1916-40b2-970b-6c33fe3a63db';

    const { output } = await runAction(getDocketEntryIdAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        isEditingDocketEntry: true,
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });

  it('should return props.primaryDocumentFileId when the docketEntry is new (not being edited) and it has a file attached', async () => {
    const mockDocketEntryId = '7979443b-e571-42b1-81d6-b09d6cc2b478';

    const { output } = await runAction(getDocketEntryIdAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          isFileAttached: true,
        },
        isEditingDocketEntry: false,
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });

  it('should return a new UUID when the docketEntry is new (not being edited) and it does NOT have a file attached', async () => {
    const mockDocketEntryId = 'd507def5-ed51-428b-8efd-5021283e5f87';
    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);

    const { output } = await runAction(getDocketEntryIdAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: mockDocketEntryId,
      },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          isFileAttached: false,
        },
        isEditingDocketEntry: false,
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });
});
