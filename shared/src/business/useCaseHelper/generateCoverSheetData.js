const { Case } = require('../entities/cases/Case');

/**
 * a helper function which assembles the correct data to be used in the generation of a PDF
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.documentEntity the document entity we are creating the cover for
 * @returns {object} the key/value pairs of computed strings
 */
exports.generateCoverSheetData = ({
  applicationContext,
  caseEntity,
  documentEntity,
}) => {
  const isLodged = documentEntity.lodged;
  const { isPaper } = documentEntity;

  const dateServedFormatted =
    (documentEntity.servedAt &&
      'Served ' +
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.servedAt, 'MMDDYYYY')) ||
    '';

  let dateReceivedFormatted;

  if (isPaper) {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MMDDYYYY')) ||
      '';
  } else {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MM/DD/YYYY hh:mm a')) ||
      '';
  }

  const dateFiledFormatted =
    (documentEntity.filingDate &&
      applicationContext
        .getUtilities()
        .formatDateString(documentEntity.filingDate, 'MMDDYYYY')) ||
    '';

  const caseCaption = caseEntity.caseCaption || Case.getCaseCaption(caseEntity);
  let caseTitle = applicationContext.getCaseTitle(caseCaption);
  let caseCaptionExtension = '';
  if (caseTitle !== caseCaption) {
    caseTitle += ', ';
    caseCaptionExtension = caseCaption.replace(caseTitle, '');
  }

  let documentTitle =
    documentEntity.documentTitle || documentEntity.documentType;
  if (documentEntity.additionalInfo && documentEntity.addToCoversheet) {
    documentTitle += ` ${documentEntity.additionalInfo}`;
  }

  const docketNumberWithSuffix =
    caseEntity.docketNumber + (caseEntity.docketNumberSuffix || '');

  const coverSheetData = {
    caseCaptionExtension,
    caseTitle,
    certificateOfService:
      documentEntity.certificateOfService === true
        ? 'Certificate of Service'
        : '',
    dateFiledLodged: dateFiledFormatted,
    dateFiledLodgedLabel: isLodged ? 'Lodged' : 'Filed',
    dateReceived: dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumber: `Docket Number: ${docketNumberWithSuffix}`,
    documentTitle,
    electronicallyFiled: documentEntity.isPaper ? '' : 'Electronically Filed',
    mailingDate: documentEntity.mailingDate || '',
  };

  return coverSheetData;
};
