import { extractedPendingMessagesFromCaseDetail as extractedPendingMessagesFromCaseDetailComputed } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { orderBy } from 'lodash';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractedPendingMessagesFromCaseDetailComputed,
);

export default (test, docketNumber = null) => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || test.docketNumber,
    });
    let result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: test.getState(),
    });
    result = result.map(message => ({
      assigneeId: message.assigneeId,
      createdAt: message.currentMessage.createdAt,
      from: message.currentMessage.from,
      fromUserId: message.currentMessage.fromUserId,
      message: message.currentMessage.message,
    }));
    expect(orderBy(result, 'message')).toMatchObject(
      orderBy(
        [
          {
            assigneeId: null,
            from: 'Test IRS Practitioner',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Answer filed by Irspractitioner is ready for review.',
          },
          {
            assigneeId: null,
            from: 'Test IRS Practitioner',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Brief in Support filed by Irspractitioner is ready for review.',
          },
          {
            assigneeId: null,
            from: 'Test IRS Practitioner',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Motion for Continuance filed by Irspractitioner is ready for review.',
          },
          {
            assigneeId: null,
            from: 'Test IRS Practitioner',
            fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Proposed Stipulated Decision filed by Irspractitioner is ready for review.',
          },
        ],
        'message',
      ),
    );
  });
};
