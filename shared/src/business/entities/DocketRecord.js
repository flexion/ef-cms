const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { getAllEventCodes } = require('../../utilities/getAllEventCodes');

/**
 * DocketRecord constructor
 *
 * @param {object} rawDocketRecord the raw docket record data
 * @constructor
 */
function DocketRecord(rawDocketRecord) {
  this.action = rawDocketRecord.action;
  this.description = rawDocketRecord.description;
  this.documentId = rawDocketRecord.documentId;
  this.editState = rawDocketRecord.editState;
  this.eventCode = rawDocketRecord.eventCode;
  this.filedBy = rawDocketRecord.filedBy;
  this.index = rawDocketRecord.index;
  this.createdAt = rawDocketRecord.createdAt || createISODateString();
}

DocketRecord.validationName = 'DocketRecord';

DocketRecord.VALIDATION_ERROR_MESSAGES = {
  description: 'Enter a description',
  eventCode: 'Enter an event code',
  index: 'Enter an index',
};

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    action: joi
      .string()
      .optional()
      .allow(null),
    createdAt: joi
      .date()
      .iso()
      .required()
      .description('When the docket record was added to the system.'),
    description: joi
      .string()
      .required()
      .description(
        'Text that describes this Docket Record item, which may be part of the Filings and Proceedings value.',
      ),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .allow(null)
      .optional()
      .description('ID of the associated PDF document in the S3 bucket.'),
    editState: joi
      .string()
      .allow(null)
      .optional()
      .description('JSON representation of the in-progress edit of this item.'),
    eventCode: joi
      .string()
      .valid(...getAllEventCodes())
      .required(),
    filedBy: joi
      .string()
      .optional()
      .allow(null)
      .description('ID of the user that filed this Docket Record item.'),
    index: joi
      .number()
      .integer()
      .required()
      .description('Index of this item in the Docket Record list.'),
  }),
  undefined,
  DocketRecord.VALIDATION_ERROR_MESSAGES,
);

module.exports = { DocketRecord };
