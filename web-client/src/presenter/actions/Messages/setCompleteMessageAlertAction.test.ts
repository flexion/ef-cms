import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCompleteMessageAlertAction } from '@web-client/presenter/actions/Messages/setCompleteMessageAlertAction';
jest.mock('@web-client/presenter/computeds/formattedWorkQueue', () => ({
  formatDateIfToday: jest.fn(),
}));
import { formatDateIfToday } from '@web-client/presenter/computeds/formattedWorkQueue';

describe('setCompleteMessageAlertAction', () => {
  const mockDateTime = '1:02 PM ET';
  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    (formatDateIfToday as jest.Mock).mockReturnValue(mockDateTime);
  });

  it('should set messagesCompletedBy to the current user name', async () => {
    const result = await runAction(setCompleteMessageAlertAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: null,
          messagesCompletedBy: null,
        },
        user: { name: 'John Doe' },
      },
    });

    expect(result.state.messagesPage.messagesCompletedBy).toBe('John Doe');
  });

  it('should set messagesCompletedAt to formatted current date', async () => {
    const result = await runAction(setCompleteMessageAlertAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: null,
          messagesCompletedBy: null,
        },
        user: { name: 'John Doe' },
      },
    });

    expect(result.state.messagesPage.messagesCompletedAt).toBe(mockDateTime);
  });

  it('should set completionSuccess to true', async () => {
    const result = await runAction(setCompleteMessageAlertAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          completionSuccess: false,
          messagesCompletedAt: null,
          messagesCompletedBy: null,
        },
        user: { name: 'John Doe' },
      },
    });

    expect(result.state.messagesPage.completionSuccess).toBe(true);
  });
});
