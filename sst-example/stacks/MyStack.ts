import { Api, StackContext } from 'sst/constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';

export function API({ stack }: StackContext) {
  const sentry = LayerVersion.fromLayerVersionArn(
    stack,
    'SentryLayer',
    `arn:aws:lambda:${stack.region}:943013980633:layer:SentryNodeServerlessSDK:35`,
  );

  // stack.addDefaultFunctionLayers([sentry]);
  // stack.addDefaultFunctionEnv({
  //   NODE_OPTIONS: '-r @sentry/serverless/dist/awslambda-auto',
  //   SENTRY_DSN:
  //     'https://3ec3073a4d12c4bfbb0214de847fcd30@o4506638650507264.ingest.sentry.io/4506638912520192',
  //   SENTRY_TRACES_SAMPLE_RATE: '1.0',
  // });

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        environment: {
          NODE_OPTIONS: '-r @sentry/serverless/dist/awslambda-auto',
          SENTRY_DSN:
            'https://3ec3073a4d12c4bfbb0214de847fcd30@o4506638650507264.ingest.sentry.io/4506638912520192',
          SENTRY_TRACES_SAMPLE_RATE: '1.0',
        },
        layers: [sentry],
      },
    },
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
