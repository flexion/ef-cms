import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { startWebSocketConnectionAction } from './startWebSocketConnectionAction';

describe('startWebSocketConnectionAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();
  const start = jest.fn();

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });

    presenter.providers.socket = { start };
  });

  it('should call the socket start function', async () => {
    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(start).toHaveBeenCalled();
  });

  it('should call the success path if there is no error when starting the socket', async () => {
    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should call the success path if the user role is irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
    });

    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });

  it('should call the error path if there is an error when starting the socket', async () => {
    start.mockRejectedValue(new Error('oh no!'));

    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });
});
