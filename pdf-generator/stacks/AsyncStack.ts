import { Function } from 'sst/constructs';
import { StackContext } from 'sst/constructs';

export function AsyncStack({ stack }: StackContext) {
  // const pdfDeadLetterQueue = new Queue(stack, 'PDFDeadLetters');

  // new Queue(stack, 'Queue', {
  //   cdk: {
  //     queue: {
  //       deadLetterQueue: {
  //         maxReceiveCount: 1,
  //         queue: pdfDeadLetterQueue.cdk.queue,
  //       },
  //     },
  //   },
  //   consumer: {
  //     function: 'src/pdf-generation.handler',
  //   },
  // });

  new Function(stack, 'PDFGeneration', {
    handler: 'src/pdf-generation.handler',
    memorySize: 3000,
    nodejs: {
      esbuild: {
        loader: {
          '.node': 'file',
        },
      },
    },
    runtime: 'nodejs18.x',
    timeout: 30,
  });
}
