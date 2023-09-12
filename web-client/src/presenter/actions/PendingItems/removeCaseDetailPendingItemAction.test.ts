import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeCaseDetailPendingItemAction } from './removeCaseDetailPendingItemAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeCaseDetailPendingItemAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the removeCasePendingItemInteractor with the data from props', async () => {
    await runAction(removeCaseDetailPendingItemAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '123abc', pending: true }],
          docketNumber: '101-20',
        },
        docketEntryId: '123abc',
      },
    });

    expect(
      applicationContext.getUseCases().removeCasePendingItemInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId: '123abc',
      docketNumber: '101-20',
    });
  });
});
