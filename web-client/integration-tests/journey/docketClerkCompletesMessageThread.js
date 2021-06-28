import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkCompletesMessageThread = integrationTest => {
  return it('docket clerk completes message thread', async () => {
    await integrationTest.runSequence('openCompleteMessageModalSequence');

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Win, Win, Win, Win',
    });

    await integrationTest.runSequence('completeMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('messageDetail').length).toEqual(3);

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    expect(messageDetailFormatted.isCompleted).toEqual(true);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    let messages = integrationTest.getState('messages');

    let foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();

    //message thread should be shown in completed box
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'completed',
      queue: 'my',
    });

    messages = integrationTest.getState('messages');

    foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
  });
};
