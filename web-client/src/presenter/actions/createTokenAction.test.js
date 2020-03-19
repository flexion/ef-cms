import { createTokenAction } from './createTokenAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('createTokenAction', () => {
  it('should create a token for a valid username', async () => {
    const result = await runAction(createTokenAction, {
      modules: {
        presenter,
      },
      state: { form: { name: 'petitioner' } },
    });

    expect(result.output.token).toBeDefined();
  });

  // TODO: skipped until cerebral bug is fixed: https://github.com/cerebral/cerebral/pull/1431
  it.skip('should throw an error if the username is not in the mock logins', async () => {
    await expect(
      runAction(createTokenAction, {
        modules: {
          presenter,
        },
        state: { form: { name: 'nachos' } },
      }),
    ).rejects.toThrow('Username not found in mock logins.');
  });
});
