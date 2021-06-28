import { clearFormAssigneeIdAction } from './clearFormAssigneeIdAction';
import { runAction } from 'cerebral/test';

describe('clearFormAssigneeIdAction', () => {
  it('should set the value of state.<form>.assigneeId to an empty string', async () => {
    const { state } = await runAction(clearFormAssigneeIdAction, {
      props: { form: 'test' },
      state: {
        myTest: {
          assigneeId: 'abc-123',
        },
      },
    });

    expect(state.myTest.assigneeId).toBe('');
  });
});
