import { createApplicationContext } from '../../web-api/src/applicationContext';

export async function handler(event: any) {
  console.log('event', event);
  const applicationContext = createApplicationContext(undefined);

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event);

  const tempId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return tempId;
}
