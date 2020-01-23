const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../../utilities/DateHandler');

/**
 * PublicDocketRecordEntry
 *
 * @param {object} rawDocketEntry the raw docket entry
 * @constructor
 */
function PublicDocketRecordEntry(rawDocketEntry) {
  this.description = rawDocketEntry.description;
  this.documentId = rawDocketEntry.documentId;
  this.filedBy = rawDocketEntry.filedBy;
  this.index = rawDocketEntry.index;
  this.createdAt = rawDocketEntry.createdAt || createISODateString();
}

joiValidationDecorator(
  PublicDocketRecordEntry,
  joi.object().keys({
    createdAt: joi
      .date()
      .iso()
      .required()
      .description('When the public docket record was added to the system.'),
    description: joi.string().optional(),
    documentId: joi.string().optional(),
    filedBy: joi
      .date()
      .iso()
      .optional(),
    index: joi
      .number()
      .integer()
      .optional(),
  }),
  undefined,
  {},
);

module.exports = { PublicDocketRecordEntry };
