import { APIGatewayProxyEvent } from 'aws-lambda';
import { generatePdfFromHtmlHelper } from './pdf/generatePdfFromHtmlHelper';
import { saveTemporaryDocument } from './s3/saveTemporaryDocument';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function handler(event: APIGatewayProxyEvent) {
  console.log('event', event);

  const body = JSON.parse(event.body ?? '{}') as any;

  const bodySchema = z.object({
    contentHtml: z.string(),
    displayHeaderFooter: z.boolean(),
    docketNumber: z.string(),
    footerHtml: z.string(),
    headerHtml: z.string(),
    overwriteFooter: z.boolean(),
  });

  const parsedBody = bodySchema.parse(body);

  const results = await generatePdfFromHtmlHelper(parsedBody);

  const tempId = uuidv4();

  await saveTemporaryDocument({
    document: results,
    key: tempId,
  });

  return tempId;
}
