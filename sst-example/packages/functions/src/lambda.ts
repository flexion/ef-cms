import * as Sentry from '@sentry/node';
import { ApiHandler } from 'sst/node/api';

Sentry.init({
  dsn: 'https://3ec3073a4d12c4bfbb0214de847fcd30@o4506638650507264.ingest.sentry.io/4506638912520192',
  environment: 'cody-test',
  tracesSampleRate: 1.0,
});

export const handler = ApiHandler(async event => {
  Sentry.captureException(new Error('ANOTHER'));
  await Sentry.flush();
  return {
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
    headers: { 'Content-Type': 'text/plain' },
    statusCode: 200,
  };
});
