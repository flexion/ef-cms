import { addPenaltyInputAction } from './addPenaltyInputAction';
import { runAction } from 'cerebral/test';

describe('addPenaltyInputAction', () => {
  it('adds a new element to the penalties array', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          penalties: ['one', 'two', 'three'],
        },
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties.length).toEqual(4);
  });

  it('creates the penalties array on modal state with one element if it is not set', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {},
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties.length).toEqual(1);
  });
});
