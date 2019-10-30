require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .handler,
  generatePrintableFilingReceiptLambda: require('./documents/generatePrintableFilingReceiptLambda')
    .handler,
  getDocumentDownloadUrlLambda: require('./documents/getDocumentDownloadUrlLambda')
    .handler,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda').handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
};
