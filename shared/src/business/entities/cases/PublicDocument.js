const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { getTimestampSchema } = require('../../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();
const { Document } = require('../Document');

/**
 * PublicDocument
 *
 * @param {object} rawDocument the raw document
 * @constructor
 */
function PublicDocument(rawDocument) {
  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.caseId = rawDocument.caseId;
  this.createdAt = rawDocument.createdAt;
  this.documentId = rawDocument.documentId;
  this.documentTitle = rawDocument.documentTitle;
  this.documentType = rawDocument.documentType;
  this.eventCode = rawDocument.eventCode;
  this.filedBy = rawDocument.filedBy;
  this.isPaper = rawDocument.isPaper;
  this.processingStatus = rawDocument.processingStatus;
  this.receivedAt = rawDocument.receivedAt;
  this.servedAt = rawDocument.servedAt;
  this.servedParties = rawDocument.servedParties;
}

joiValidationDecorator(
  PublicDocument,
  joi.object().keys({
    additionalInfo: joi.string().max(500).optional(),
    additionalInfo2: joi.string().max(500).optional(),
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    createdAt: joiStrictTimestamp.optional(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    documentTitle: joi.string().max(500).optional(),
    documentType: joi
      .string()
      .valid(...Document.getDocumentTypes())
      .optional(),
    eventCode: joi.string().optional(), // TODO add enumeration
    filedBy: joi.string().max(100).optional(),
    isPaper: joi.boolean().optional(),
    processingStatus: joi
      .string()
      .valid(...Document.PROCESSING_STATUSES)
      .optional(),
    receivedAt: joiStrictTimestamp.optional(),
    servedAt: joiStrictTimestamp.optional(),
    servedParties: joi
      .array()
      .items({ name: joi.string().max(500).required() })
      .optional(),
  }),
  {},
);

module.exports = { PublicDocument };
