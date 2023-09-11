import * as lambda from 'aws-cdk-lib/aws-lambda';
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
    copyFiles: [
      {
        from: 'node_modules/@sparticuz/chromium/bin',
        to: 'bin',
      },
    ],
    handler: 'src/pdf-generation.handler',
    memorySize: 3000,
    runtime: 'nodejs18.x',
    timeout: 30,
  });
}
