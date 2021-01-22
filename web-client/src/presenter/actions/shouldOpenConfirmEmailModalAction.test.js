import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldOpenConfirmEmailModalAction } from './shouldOpenConfirmEmailModalAction';

describe('shouldOpenConfirmEmailModalAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the no path if originalEmail and email are the same', async () => {
    runAction(shouldOpenConfirmEmailModalAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email: 'test@example.com',
          originalEmail: 'test@example.com',
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('returns the no path if originalEmail and email are the same when compared regardless of capitalization', async () => {
    runAction(shouldOpenConfirmEmailModalAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email: 'test@example.com',
          originalEmail: 'TEST@example.com',
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('returns the yes path if originalEmail and email are not the same', async () => {
    runAction(shouldOpenConfirmEmailModalAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email: 'test@example.com',
          originalEmail: 'yolo@example.com',
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
