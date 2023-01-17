import { MOCK_WORK_ITEM } from '../../../../../shared/src/test/mockWorkItem';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWorkItemAction } from './getWorkItemAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getWorkItemAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should make a call to get the work item by id and return it to props', async () => {
    const mockDocketEntryId = '6902b408-2837-44c6-a850-fe9a4a859df9';
    const mockWorkItemId = '97d757c1-c6a1-47eb-8b64-cc4fecd7f852';
    applicationContext
      .getUseCases()
      .getWorkItemInteractor.mockResolvedValue(MOCK_WORK_ITEM);

    const { output } = await runAction(getWorkItemAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              workItem: {
                workItemId: mockWorkItemId,
              },
            },
          ],
        },
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(
      applicationContext.getUseCases().getWorkItemInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { workItemId: mockWorkItemId });
    expect(output.workItem).toEqual(MOCK_WORK_ITEM);
  });
});
