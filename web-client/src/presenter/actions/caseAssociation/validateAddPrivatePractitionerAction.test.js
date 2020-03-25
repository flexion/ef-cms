import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddPrivatePractitionerAction } from './validateAddPrivatePractitionerAction';

describe('validateAddPrivatePractitioner', () => {
  let applicationContext;
  let successStub;
  let errorStub;

  let mockAddPrivatePractitioner;

  beforeEach(() => {
    applicationContext = applicationContextForClient;
    successStub = jest.fn();
    errorStub = jest.fn();

    mockAddPrivatePractitioner = {
      representingPrimary: true,
      user: { userId: 'abc' },
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
      .validateAddPrivatePractitionerInteractor.mockReturnValue(null);

    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(successStub).toHaveBeenCalledTimes(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateAddPrivatePractitionerInteractor.mockReturnValue('error');

    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(errorStub).toHaveBeenCalledTimes(1);
  });
});
