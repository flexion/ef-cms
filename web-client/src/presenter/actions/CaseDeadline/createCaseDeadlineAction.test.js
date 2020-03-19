import { createCaseDeadlineAction } from './createCaseDeadlineAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('createCaseDeadlineAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createCaseDeadlineInteractor: () => 'something',
      }),
      getUtilities: () => ({
        createISODateString: () => '2019-03-01T21:42:29.073Z',
      }),
    };
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls createCaseDeadlineInteractor', async () => {
    await runAction(createCaseDeadlineAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-07-04',
      },
      state: {
        caseDetail: { caseId: 'abc' },
        form: {
          description: 'sdsdfslkdj',
        },
        user: {
          token: 'docketclerk',
        },
      },
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
