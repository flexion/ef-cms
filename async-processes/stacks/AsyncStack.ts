import { Queue } from 'sst/constructs';
import { StackContext } from 'sst/constructs';

export function AsyncStack({ stack }: StackContext) {
  // const queue = new Queue(stack, 'ChangeOfAddressQueue');

  // new Function(stack, 'ChangeOfAddress', {
  //   handler: 'src/change-of-address.handler',
  //   runtime: 'nodejs18.x',
  // });
  new Queue(stack, 'Queue', {
    consumer: {
      cdk: {
        eventSource: {
          maxConcurrency: 5,
        },
      },
      function: 'src/change-of-address.handler',
    },
  });

  // Show the endpoint in the output
  // stack.addOutputs({
  //   ApiEndpoint: api.url,
  // });
}
