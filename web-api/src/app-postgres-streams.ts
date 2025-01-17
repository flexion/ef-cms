import { processStreamPostgresLambda } from '@web-api/lambdas/streams/processStreamPostgresLambda';
import express from 'express';

// ************************ streams-local *********************************
const localStreamsApp = express();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('pre-processStreamPostgresLambda');
  await processStreamPostgresLambda();
  console.log('post-processStreamPostgresLambda');
})();

localStreamsApp.listen(5090);
