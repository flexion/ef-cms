import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCourtIssuedDocketEntryAction } from './validateCourtIssuedDocketEntryAction';

describe('validateCourtIssuedDocketEntryAction', () => {
  let successStub;
  let errorStub;
  let mockDocketEntry;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);
    await runAction(validateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue('error');
    await runAction(validateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
