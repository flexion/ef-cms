import { range } from 'lodash';

import { payload } from './fixtures/out';

const { InvokeCommand, LambdaClient } = require('@aws-sdk/client-lambda');

const lambdaFunctionArn =
  'arn:aws:lambda:us-east-1:515554424717:function:prod-efcms-AsyncStack-PDFGenerator176BFC25-dJ5XZ8zxff8Q';

const invocationCount = 1;
const batches = 1000;

const lambdaClient = new LambdaClient({ region: 'us-east-1' });

const invokeLambda = async () => {
  for (let i = 0; i < batches; i++) {
    await Promise.all(
      range(0, invocationCount).map(async () => {
        let responseString;
        if (process.env.LOCAL) {
          responseString = await fetch(
            'http://localhost:8333/2015-03-31/functions/function/invocations',
            {
              body: JSON.stringify({
                body: JSON.stringify(payload),
              }).replace(
                '</p></div></div></div></body></html>',
                `${new Array(1000 + Math.floor(Math.random() * 10000))
                  .fill('what is up ')
                  .join('')}</p></div></div></div></body></html>`,
              ),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            },
          ).then(r => r.json());
        } else {
          const response = await lambdaClient.send(
            new InvokeCommand({
              FunctionName: lambdaFunctionArn,
              Payload: JSON.stringify({
                body: JSON.stringify(payload),
              }),
            }),
          );
          responseString = new TextDecoder().decode(response.Payload);
        }
        console.log('invoking lambda', responseString);
      }),
    );
  }
};

invokeLambda();
