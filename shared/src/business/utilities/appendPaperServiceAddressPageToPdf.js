const { PDFDocument } = require('pdf-lib');

exports.appendPaperServiceAddressPageToPdf = async ({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDoc,
  servedParties,
}) => {
  const addressPages = await exports.getAddressPages({
    applicationContext,
    caseEntity,
    servedParties,
  });

  console.log('addressPages', addressPages);

  await exports.copyToNewPdf({
    addressPages,
    newPdfDoc,
    noticeDoc,
  });
};

exports.copyToNewPdf = async ({ addressPages, newPdfDoc, noticeDoc }) => {
  for (let addressPage of addressPages) {
    const addressPageDoc = await PDFDocument.load(addressPage);
    let copiedPages = await newPdfDoc.copyPages(
      addressPageDoc,
      addressPageDoc.getPageIndices(),
    );
    copiedPages.forEach(newPdfDoc.addPage);

    copiedPages = await newPdfDoc.copyPages(
      noticeDoc,
      noticeDoc.getPageIndices(),
    );
    copiedPages.forEach(newPdfDoc.addPage);
  }
};

exports.getAddressPages = async ({
  applicationContext,
  caseEntity,
  servedParties,
}) => {
  const addressPages = [];
  for (let party of servedParties.paper) {
    addressPages.push(
      await applicationContext
        .getUseCaseHelpers()
        .generatePaperServiceAddressPagePdf({
          applicationContext,
          contactData: party,
          docketNumberWithSuffix: `${
            caseEntity.docketNumber
          }${caseEntity.docketNumberSuffix || ''}`,
        }),
    );
  }
  return addressPages;
};
