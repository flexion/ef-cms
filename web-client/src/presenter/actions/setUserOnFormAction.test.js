import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setUserOnFormAction } from './setUserOnFormAction';

describe('setUserOnFormAction', () => {
  it('sets editable user fields from props.user on state.form', async () => {
    const result = await runAction(setUserOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        user: {
          barNumber: 'TU1234',
          contact: {
            address1: '123 Main St',
          },
          email: 'testing@example.com',
          name: 'Test User',
          userId: '123',
        },
      },
      state: {},
    });
    expect(result.state.form).toEqual({
      barNumber: 'TU1234',
      contact: {
        address1: '123 Main St',
      },
      email: 'testing@example.com',
      name: 'Test User',
      originalEmail: 'testing@example.com',
    });
  });
});
