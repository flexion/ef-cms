import { range } from 'lodash';

import { payload } from './fixtures/out';

const { InvokeCommand, LambdaClient } = require('@aws-sdk/client-lambda');

const lambdaFunctionArn =
  'arn:aws:lambda:us-east-1:515554424717:function:prod-efcms-AsyncStack-PDFGenerator176BFC25-dJ5XZ8zxff8Q';

const invocationCount = 1;
const batches = 1;

const lambdaClient = new LambdaClient({ region: 'us-east-1' });

const invokeLambda = async () => {
  for (let i = 0; i < batches; i++) {
    await Promise.all(
      range(0, invocationCount).map(async () => {
        const command = new InvokeCommand({
          FunctionName: lambdaFunctionArn,
          Payload: JSON.stringify({
            body: JSON.stringify(payload),
          }),
        });
        const response = await lambdaClient.send(command);
        const responseString = new TextDecoder().decode(response.Payload);
        console.log('invoking lambda', responseString);
      }),
    );
  }
};

invokeLambda();
