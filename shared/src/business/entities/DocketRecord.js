const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param docketRecord
 * @constructor
 */
function DocketRecord(rawDocketRecord) {
  Object.assign(this, {
    description: rawDocketRecord.description,
    documentId: rawDocketRecord.documentId,
    filedBy: rawDocketRecord.filedBy,
    filingDate: rawDocketRecord.filingDate,
    index: rawDocketRecord.index,
    status: rawDocketRecord.status,
  });
}

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    description: joi
      .string()
      .optional()
      .allow(null),
    documentId: joi
      .string()
      .allow(null)
      .optional(),
    filedBy: joi
      .string()
      .optional()
      .allow(null),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required(),
    index: joi
      .number()
      .integer()
      .optional(),
    status: joi
      .string()
      .allow(null)
      .optional(),
  }),
  () => true,
  {},
);

module.exports = { DocketRecord };
