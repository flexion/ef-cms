import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { checkEmailAvailabilityAction } from './checkEmailAvailabilityAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('checkEmailAvailabilityAction', () => {
  const mockEmail = 'someone@example.com';

  let pathEmailAvailableStub;
  let pathEmailInUseStub;

  beforeEach(() => {
    pathEmailAvailableStub = jest.fn();
    pathEmailInUseStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      emailAvailable: pathEmailAvailableStub,
      emailInUse: pathEmailInUseStub,
    };
  });

  it('should call checkEmailAvailabilityInteractor with state.form.updatedEmail', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { updatedEmail: mockEmail },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][0],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.email when state.form.updatedEmail is undefined', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][0],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.contactPrimary.email', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contactPrimary: { email: mockEmail } },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][0],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call path.emailAvailable when checkEmailAvailabilityInteractor returns true', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockReturnValue(true);

    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(pathEmailAvailableStub).toHaveBeenCalled();
  });

  it('should call path.emailInUse when checkEmailAvailabilityInteractor returns false', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockReturnValue(false);

    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(pathEmailInUseStub).toHaveBeenCalled();
  });
});
