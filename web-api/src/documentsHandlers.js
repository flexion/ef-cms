module.exports = {
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .handler,
  generatePrintableFilingReceiptLambda: require('./documents/generatePrintableFilingReceiptLambda')
    .handler,
  getDocumentDownloadUrlLambda: require('./documents/getDocumentDownloadUrlLambda')
    .handler,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda').handler,
  sanitizePdfLambda: require('./documents/sanitizePdfLambda').handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda').handler,
};
