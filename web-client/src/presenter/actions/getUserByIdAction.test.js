import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserByIdAction } from './getUserByIdAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUserByIdAction', () => {
  beforeAll(() => {});

  it('should call the user and return the user from the use case', async () => {
    const results = await runAction(getUserByIdAction, {
      modules: {},
      props: {
        userId: '123',
      },
    });

    expect(results.output.user).toEqual({
      role: 'privatePractitioner',
      userId: '123',
    });
  });
});
