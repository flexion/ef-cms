import { generatePdfFromHtmlHelper } from './pdf/generatePdfFromHtmlHelper';
import { saveTemporaryDocument } from './s3/saveTemporaryDocument';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

let warm = false;

export async function handler(event: any) {
  console.log(`is warm = ${warm}`);
  warm = true;
  const body = JSON.parse(event.body ?? '{}') as any;

  const bodySchema = z.object({
    contentHtml: z.string(),
    displayHeaderFooter: z.boolean(),
    docketNumber: z.string().optional(),
    footerHtml: z.string().optional(),
    headerHtml: z.string().optional(),
    overwriteFooter: z.boolean().optional(),
  });

  const parsedBody = bodySchema.parse(body);

  console.log('generating the pdf');
  const results = await generatePdfFromHtmlHelper(parsedBody);
  console.log('done generating the pdf');

  const tempId = uuidv4();

  await saveTemporaryDocument({
    document: results,
    key: tempId,
  });

  return tempId;
}
