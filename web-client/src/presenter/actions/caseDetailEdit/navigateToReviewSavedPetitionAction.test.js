import { navigateToReviewSavedPetitionAction } from './navigateToReviewSavedPetitionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToReviewSavedPetitionAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to review url', async () => {
    await runAction(navigateToReviewSavedPetitionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        documentId: 'abc',
      },
    });

    expect(routeStub).toHaveBeenCalled();
  });
});
