import 'dotenv/config';
import { expect, it } from 'vitest';

import { default as fs } from 'fs';
import { getTemporaryDocument } from '../src/s3/getTemporaryDocument';
import { handler } from '../src/index';
import { setEnv } from '../src/config/getEnv';

it('should throw an error if the passed in json body is invalid', () => {
  expect(() =>
    handler({
      body: JSON.stringify({ some: 'invalid json' }),
    } as any),
  ).rejects.toThrow();
});

it('should create a pdf and store in specified s3 bucket', async () => {
  setEnv('S3_ENDPOINT', 'http://0.0.0.0:9000');
  setEnv('TEMP_DOCUMENTS_BUCKET_NAME', 'noop-temp-documents-local-us-east-1');
  setEnv('AWS_ACCESS_KEY_ID', 'S3RVER');
  setEnv('AWS_SECRET_ACCESS_KEY', 'S3RVER');

  const s3Id = await handler({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      footerHtml: '<div>footer<div>',
      headerHtml: '<div>header<div>',
      overwriteFooter: true,
    }),
  } as any);

  const document = await getTemporaryDocument({
    key: s3Id,
  });

  (document.Body as any).pipe(
    fs.createWriteStream('./output/out2.pdf', {
      encoding: 'binary',
    }),
  );
});
