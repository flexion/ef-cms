const fs = require('fs');
const gs = require('ghostscript4js');
const tmp = require('tmp');

/**
 * sanitizes PDF input, removing interactive elements
 * @param pdfData {{Uint8Array}} unknown.. buffer?
 * @returns {Uint8Array}
 */
exports.sanitizePdf = async ({ applicationContext, documentId }) => {
  let inputPdf, intermediatePostscript, outputPdf, newPdfData;

  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  try {
    // write original PDF to disk
    inputPdf = tmp.fileSync();
    fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
    fs.closeSync(inputPdf.fd);

    // create temp working files
    intermediatePostscript = tmp.fileSync();
    fs.closeSync(intermediatePostscript.fd);

    outputPdf = tmp.fileSync();
    fs.closeSync(outputPdf.fd);

    const pdf2ps_cmd = [
      '-q',
      '-dQUIET',
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-sDEVICE=ps2write',
      `-sOutputFile=${intermediatePostscript.name}`,
      `-f ${inputPdf.name}`,
    ].join(' ');
    const ps2pdf_cmd = [
      '-q',
      '-dQUIET',
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-dNOCACHE',
      '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/prepress',
      '-sColorConversionStrategy=/LeaveColorUnchanged',
      '-dAutoFilterColorImages=true',
      '-dAutoFilterGrayImages=true',
      '-dDownsampleMonoImages=true',
      '-dDownsampleGrayImages=true',
      '-dDownsampleColorImages=true',
      `-sOutputFile=${outputPdf.name}`,
      `-f ${intermediatePostscript.name}`,
    ].join(' ');

    // run GS conversions
    gs.executeSync(pdf2ps_cmd);
    gs.executeSync(ps2pdf_cmd);

    // read GS results and return them
    newPdfData = fs.readFileSync(outputPdf.name);

    // remove temp-files we no longer need
    inputPdf.removeCallback();
    intermediatePostscript.removeCallback();
    outputPdf.removeCallback();
  } catch (err) {
    throw err;
  }

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });
  applicationContext.logger.timeEnd('Saving S3 Document');

  return newPdfData;
};
