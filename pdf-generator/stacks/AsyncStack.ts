import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'sst/constructs';
import { Duration } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
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

  const bucket = new Bucket(stack, 'ATempBucket');

  const lambdaFunction = new lambda.DockerImageFunction(stack, 'PDFGenerator', {
    code: lambda.DockerImageCode.fromImageAsset('./app'),
    memorySize: 2048,
    timeout: Duration.seconds(30),
  });

  lambdaFunction.addEnvironment(
    'S3_ENDPOINT',
    'https://s3.us-east-1.amazonaws.com',
  );
  lambdaFunction.addEnvironment(
    'TEMP_DOCUMENTS_BUCKET_NAME',
    bucket.bucketName,
  );
  lambdaFunction.addEnvironment('NODE_ENV', 'production');

  lambdaFunction.addToRolePolicy(
    new PolicyStatement({
      actions: ['s3:GetObject', 's3:PutObject'],
      resources: [`${bucket.bucketArn}/*`],
    }),
  );

  stack.addOutputs({
    LambdaName: lambdaFunction.functionName,
  });
}
