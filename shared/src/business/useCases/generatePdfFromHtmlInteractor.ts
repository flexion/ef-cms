import { ALLOWLIST_FEATURE_FLAGS } from '../entities/EntityConstants';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

export const generatePdfFromHtmlInteractor = async (
  applicationContext: IApplicationContext,
  {
    contentHtml,
    displayHeaderFooter = true,
    docketNumber,
    footerHtml,
    headerHtml,
    overwriteFooter,
  }: {
    contentHtml: string;
    displayHeaderFooter?: boolean;
    docketNumber?: string;
    footerHtml?: string;
    headerHtml?: string;
    overwriteFooter?: string;
  },
): Promise<Buffer> => {
  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const sendGenerateEvent =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.USE_EXTERNAL_PDF_GENERATION.key];

  let key;

  if (sendGenerateEvent) {
    const { currentColor, region, stage } = applicationContext.environment;
    const client = new LambdaClient({
      region,
    });
    const command = new InvokeCommand({
      FunctionName: `pdf_generator_${stage}_${currentColor}`,
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(
        JSON.stringify({
          contentHtml,
          displayHeaderFooter,
          docketNumber,
          footerHtml,
          headerHtml,
          overwriteFooter,
        }),
      ),
    });
    const response = await client.send(command);
    const textDecoder = new TextDecoder('utf-8');
    const responseStr = textDecoder.decode(response.Payload);
    key = JSON.parse(responseStr);
  } else {
    key = await fetch(
      'http://localhost:8333/2015-03-31/functions/function/invocations',
      {
        body: JSON.stringify({
          body: JSON.stringify({
            contentHtml,
            displayHeaderFooter,
            docketNumber,
            footerHtml,
            headerHtml,
            overwriteFooter,
          }),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    ).then(r => {
      return r.json();
    });
  }

  return await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
    useTempBucket: true,
  });
};
