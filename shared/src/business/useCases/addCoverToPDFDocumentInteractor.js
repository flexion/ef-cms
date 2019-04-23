const fs = require('fs');
const path = require('path');
const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  drawText,
  drawImage,
  drawLinesOfText,
} = require('pdf-lib');
const { Case } = require('../entities/Case');
const { flattenDeep } = require('lodash');

/**
 * addCoverToPDFDocument
 *
 * @param pdfData // Uint8Array
 * @param coverSheetData
 */
exports.addCoverToPDFDocument = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  applicationContext.logger.time('Fetching the Case');
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });
  applicationContext.logger.timeEnd('Fetching the Case');

  const caseEntity = new Case(caseRecord);

  const documentEntity = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  const documentIndex = caseEntity.documents.findIndex(
    document => document.documentId === documentId,
  );

  let dateServedFormatted = '';
  if (caseEntity.irsSendDate) {
    const dateServed = new Date(caseEntity.irsSendDate);
    dateServedFormatted = `SERVED ${dateServed.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  }

  const dateReceived = new Date(documentEntity.createdAt);
  const dateReceivedFormatted = `${dateReceived.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} ${dateReceived.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })}`;
  const dateFiled = new Date(caseEntity.createdAt);
  const dateFiledFormatted = dateFiled.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const isLodged = documentEntity.lodged;

  const caseCaption = Case.getCaseCaption(caseRecord);
  const caseCaptionNames = Case.getCaseCaptionNames(caseCaption);

  const coverSheetData = {
    caseCaptionPetitioner: caseCaptionNames,
    caseCaptionRespondent: 'Commissioner of Internal Revenue',
    dateFiled: isLodged ? '' : dateFiledFormatted,
    dateLodged: isLodged ? dateFiledFormatted : '',
    dateReceived: dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumber:
      caseEntity.docketNumber + (caseEntity.docketNumberSuffix || ''),
    documentTitle: documentEntity.documentType,
    includesCertificateOfService:
      documentEntity.certificateOfService === true ? true : false,
    originallyFiledElectronically: !caseEntity.isPaper,
  };

  applicationContext.logger.time('Fetching S3 File');
  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  applicationContext.logger.timeEnd('Fetching S3 File');

  // Dimensions of cover page - 8.5"x11" @ 300dpi
  const dimensionsX = 2550;
  const dimensionsY = 3300;
  const minimumAcceptableWidth = 600;
  const coverPageDimensions = [dimensionsX, dimensionsY];
  const horizontalMargin = 215; // left and right margins
  const verticalMargin = 190; // top and bottom margins
  const defaultFontName = 'Helvetica';
  const defaultFontSize = 48;
  const fontSizeCaption = 64;
  const fontSizeTitle = 80;

  // create pdfDoc object from file data
  applicationContext.logger.time('Loading the PDF');
  const pdfDoc = PDFDocumentFactory.load(pdfData);
  applicationContext.logger.time('Loading the PDF');

  const pages = pdfDoc.getPages();
  const originalPageDimensions = getPageDimensions(pages[0]);
  const originalPageWidth = originalPageDimensions.width;

  const scaleToPageWidth =
    originalPageWidth >= minimumAcceptableWidth
      ? originalPageWidth
      : minimumAcceptableWidth;

  // USTC Seal (png) to embed in header
  applicationContext.logger.time('Embed PNG');
  const staticImgPath = path.join(__dirname, '../../../static/images/');
  const ustcSealBytes = fs.readFileSync(staticImgPath + 'ustc_seal.png');
  const [pngSeal, pngSealDimensions] = pdfDoc.embedPNG(ustcSealBytes);
  applicationContext.logger.timeEnd('Embed PNG');

  // Embed font to use for cover page generation
  applicationContext.logger.time('Embed Font');
  const [helveticaRef, helveticaFont] = pdfDoc.embedStandardFont('Helvetica');
  const [helveticaBoldRef, helveticaBoldFont] = pdfDoc.embedStandardFont(
    'Helvetica-Bold',
  );
  applicationContext.logger.timeEnd('Embed Font');

  // Generate cover page
  applicationContext.logger.time('Generate Cover Page');
  const coverPage = pdfDoc
    .createPage(coverPageDimensions.map(dim => pageScaler(dim)))
    .addImageObject('USTCSeal', pngSeal)
    .addFontDictionary('Helvetica', helveticaRef)
    .addFontDictionary('Helvetica-Bold', helveticaBoldRef);
  applicationContext.logger.timeEnd('Generate Cover Page');

  function getPageDimensions(page) {
    let mediaBox;

    // Check for MediaBox on the page itself
    const hasMediaBox = !!page.getMaybe('MediaBox');
    if (hasMediaBox) {
      mediaBox = page.index.lookup(page.get('MediaBox'));
    }

    // Check for MediaBox on each parent node
    page.Parent.ascend(parent => {
      const parentHasMediaBox = !!parent.getMaybe('MediaBox');
      if (!mediaBox && parentHasMediaBox) {
        mediaBox = parent.index.lookup(parent.get('MediaBox'));
      }
    }, true);

    // This should never happen in valid PDF files
    if (!mediaBox) throw new Error('Page Tree is missing MediaBox');

    // Extract and return the width and height
    return {
      height: mediaBox.array[3].number,
      width: mediaBox.array[2].number,
    };
  }

  function pageScaler(value) {
    return Math.round(value * (scaleToPageWidth / dimensionsX));
  }

  function paddedLineHeight(fontSize = defaultFontSize) {
    return fontSize * 0.25 + fontSize;
  }

  function getContentByKey(key) {
    const coverSheetDatumValue = coverSheetData[key];
    switch (key) {
      case 'includesCertificateOfService':
        if (coverSheetDatumValue === true) {
          return 'Certificate of Service';
        } else {
          return '';
        }
      case 'originallyFiledElectronically':
        if (coverSheetDatumValue === true) {
          return 'Electronically Filed';
        } else {
          return '';
        }
      default:
        return coverSheetDatumValue.toString();
    }
  }
  // Point of origin is bottom left, this flips the y-axis
  // coord to a traditional top left value
  function translateY(yPos, screenToPrintDpi) {
    const newY = dimensionsY - yPos;
    if (screenToPrintDpi) {
      return (300 / 72) * newY;
    } else {
      return newY;
    }
  }

  function getYOffsetFromPreviousContentArea(
    previousContentArea,
    font,
    fontSize,
    offsetMargin = 0,
  ) {
    let totalContentHeight;
    const textHeight = font.heightOfFontAtSize(fontSize);
    if (Array.isArray(previousContentArea.content)) {
      // Multiple lines of text
      totalContentHeight = previousContentArea.content.length * textHeight;
    } else {
      // Single line of text
      totalContentHeight = textHeight;
    }
    // we subtract here because coords start at bottom left;
    return Math.round(
      previousContentArea.yPos - totalContentHeight - offsetMargin,
    );
  }

  // Measures text width against given widthConstraint to
  // break into multiple lines (expressed as an array)
  function wrapText(text, widthConstraint, font, fontSize) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    if (textWidth <= widthConstraint) {
      return text;
    } else {
      // break the text up and test its width
      const textArry = text.split(' ');

      // This doesn't feel super effecient, so maybe come back to this
      const textLines = textArry.reduce(function(acc, cur) {
        const accLength = acc.length;
        const lastIndex = accLength > 0 ? acc.length - 1 : 0;
        const proposedLine = accLength > 0 ? `${acc[lastIndex]} ${cur}` : cur;
        const proposedLineWidth = font.widthOfTextAtSize(
          proposedLine,
          fontSize,
        );

        if (acc.length && proposedLineWidth <= widthConstraint) {
          acc[lastIndex] = proposedLine;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);
      return textLines;
    }
  }

  const dateFiledLabel = isLodged ? '' : 'Filed';
  const dateLodgedLabel = isLodged ? 'Lodged' : '';

  // Content areas
  const contentDateReceivedLabel = {
    content: 'Received',
    fontName: 'Helvetica-Bold',
    xPos: 900,
    yPos: 3036,
  };

  const contentDateReceived = {
    content: getContentByKey('dateReceived'),
    xPos: 800,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateReceivedLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.heightOfFontAtSize(defaultFontSize),
    ),
  };

  const contentDateLodgedLabel = {
    content: dateLodgedLabel,
    fontName: 'Helvetica-Bold',
    xPos: 1440,
    yPos: 3036,
  };

  const contentDateLodged = {
    content: getContentByKey('dateLodged'),
    xPos: 1415,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateLodgedLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.heightOfFontAtSize(defaultFontSize),
    ),
  };

  const contentDateFiledLabel = {
    content: dateFiledLabel,
    fontName: 'Helvetica-Bold',
    xPos: 1938,
    yPos: 3036,
  };

  const contentDateFiled = {
    content: getContentByKey('dateFiled'),
    xPos: 1883,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateFiledLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.heightOfFontAtSize(defaultFontSize),
    ),
  };

  const contentCaseCaptionPet = {
    content: wrapText(
      getContentByKey('caseCaptionPetitioner'),
      1042,
      helveticaFont,
      fontSizeCaption,
    ),
    fontSize: fontSizeCaption,
    xPos: horizontalMargin,
    yPos: 2534,
  };

  const contentPetitionerLabel = {
    content: 'Petitioner(s)',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentCaseCaptionPet,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.heightOfFontAtSize(fontSizeCaption),
    ),
  };

  const contentVLabel = {
    content: 'v.',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentPetitionerLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.heightOfFontAtSize(fontSizeCaption),
    ),
  };

  const contentCaseCaptionResp = {
    content: wrapText(
      getContentByKey('caseCaptionRespondent'),
      1042,
      helveticaFont,
      fontSizeCaption,
    ),
    fontSize: fontSizeCaption,
    xPos: horizontalMargin,
    yPos: getYOffsetFromPreviousContentArea(
      contentVLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.heightOfFontAtSize(fontSizeCaption),
    ),
  };

  const contentRespondentLabel = {
    content: 'Respondent(s)',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentCaseCaptionResp,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.heightOfFontAtSize(fontSizeCaption),
    ),
  };

  const contentElectronicallyFiled = {
    content: getContentByKey('originallyFiledElectronically'),
    fontSize: fontSizeCaption,
    xPos: 1530,
    yPos: contentPetitionerLabel.yPos,
  };

  const contentDocketNumber = {
    content: `Docket Number: ${getContentByKey('docketNumber')}`,
    fontSize: fontSizeCaption,
    xPos: 1530,
    yPos: contentVLabel.yPos,
  };

  const contentDocumentTitle = {
    centerTextAt: {
      centerXOffset: 531, // same x offset as xpos
      centerXWidth: 1488, // same width as wrap text method
      fontObj: helveticaFont,
    },
    content: wrapText(
      getContentByKey('documentTitle'),
      1488,
      helveticaFont,
      fontSizeTitle,
    ),
    fontSize: fontSizeTitle,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentRespondentLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.heightOfFontAtSize(fontSizeCaption) * 8,
    ),
  };

  const contentCertificateOfService = {
    content: getContentByKey('includesCertificateOfService'),
    xPos: horizontalMargin,
    yPos: getYOffsetFromPreviousContentArea(
      contentDocumentTitle,
      helveticaFont,
      fontSizeTitle,
      helveticaFont.heightOfFontAtSize(fontSizeCaption) * 10,
    ),
  };

  const contentDateServed = {
    centerTextAt: {
      centerXOffset: 531, // same x offset as xpos
      centerXWidth: 1488, // same width as wrap text method
      fontObj: helveticaFont,
    },
    content: getContentByKey('dateServed'),
    fontName: 'Helvetica-Bold',
    fontSize: fontSizeTitle,
    xPos: 531,
    yPos: 231,
  };

  function drawContent(contentArea) {
    const {
      centerTextAt,
      content,
      xPos,
      yPos,
      fontSize,
      fontName,
    } = contentArea;

    const params = {
      colorRgb: [0, 0, 0],
      font: fontName || defaultFontName,
      lineHeight: pageScaler(paddedLineHeight(fontSize)),
      size: pageScaler(fontSize || defaultFontSize),
      x: pageScaler(xPos),
      y: pageScaler(yPos),
    };

    const centeringText = !!(
      centerTextAt && Object.keys(centerTextAt).length === 3
    );

    function setCenterPos(content, params) {
      if (centeringText === false) {
        return params;
      }

      const { centerXOffset, centerXWidth, fontObj } = centerTextAt;
      const textWidth = fontObj.widthOfTextAtSize(content, params.size);
      const newXOffset =
        (pageScaler(centerXWidth) - textWidth) / 2 + pageScaler(centerXOffset);
      return {
        ...params,
        x: newXOffset,
      };
    }

    if (Array.isArray(content)) {
      if (centeringText === true) {
        // We do this because we need to insert the lines individually
        const contentLines = content.map((cont, idx) => {
          const newParams = setCenterPos(cont, params);
          newParams.y = params.y - params.lineHeight * idx;
          return drawText(cont, newParams);
        });
        return contentLines;
      } else {
        return drawLinesOfText(content, params);
      }
    } else {
      return drawText(content, setCenterPos(content, params));
    }
  }

  // This is where the magic happens. The content stream and its coords will need to be
  // played with in order to get the desired cover page layout.
  const coverPageContentStream = pdfDoc.createContentStream(
    drawImage('USTCSeal', {
      height: pageScaler(pngSealDimensions.height / 2),
      width: pageScaler(pngSealDimensions.width / 2),
      x: pageScaler(horizontalMargin),
      y: pageScaler(translateY(verticalMargin + pngSealDimensions.height / 2)),
    }),
    ...flattenDeep(
      [
        contentDateReceivedLabel,
        contentDateReceived,
        contentDateLodgedLabel,
        contentDateLodged,
        contentDateFiledLabel,
        contentDateFiled,
        contentCaseCaptionPet,
        contentPetitionerLabel,
        contentVLabel,
        contentCaseCaptionResp,
        contentRespondentLabel,
        contentElectronicallyFiled,
        contentDocketNumber,
        contentDocumentTitle,
        contentCertificateOfService,
        contentDateServed,
      ].map(cont => drawContent(cont)),
    ),
  );

  // Add the content stream to our newly created page
  coverPage.addContentStreams(pdfDoc.register(coverPageContentStream));

  // Insert cover page at position 0 (first) in the document. This is non-destructive, and
  // pushes the original first page to page two.
  pdfDoc.insertPage(0, coverPage);

  // Write our pdfDoc object to byte array, ready to physically write to disk or upload
  // to file server
  applicationContext.logger.time('Saving Bytes');
  const newPdfData = PDFDocumentWriter.saveToBytes(pdfDoc);
  applicationContext.logger.timeEnd('Saving Bytes');

  documentEntity.processingStatus = 'complete';

  applicationContext.logger.time('Updating Document Status');
  await applicationContext
    .getPersistenceGateway()
    .updateDocumentProcessingStatus({
      applicationContext,
      caseId,
      documentIndex,
    });
  applicationContext.logger.timeEnd('Updating Document Status');

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });
  applicationContext.logger.timeEnd('Saving S3 Document');

  return newPdfData;
};
