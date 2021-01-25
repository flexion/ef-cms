import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateUserContactAction } from './validateUserContactAction';

const errorMock = jest.fn();
const successMock = jest.fn();

describe('validateUserContactAction', () => {
  const mockEmail = 'test@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if user is invalid', async () => {
    applicationContext
      .getUseCases()
      .validateUserContactInteractor.mockReturnValue({
        postalCode: 'Enter a valid postal code',
      });
    await runAction(validateUserContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: {}, email: mockEmail, originalEmail: mockEmail },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the success path if user is valid', async () => {
    applicationContext
      .getUseCases()
      .validateUserContactInteractor.mockReturnValue(undefined);
    await runAction(validateUserContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: {}, email: mockEmail, originalEmail: mockEmail },
      },
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('should return the path.error with an email error in the errors object', async () => {
    applicationContext
      .getUseCases()
      .validateUserContactInteractor.mockReturnValue({
        email: 'some email error',
      });

    await runAction(validateUserContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: {}, email: mockEmail, originalEmail: mockEmail },
      },
    });

    expect(errorMock.mock.calls[0][0]).toMatchObject({
      errors: {
        contact: { email: 'some email error' },
      },
    });
  });
});
