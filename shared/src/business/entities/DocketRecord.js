const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param docketRecord
 * @constructor
 */
function DocketRecord(docketRecord) {
  Object.assign(this, docketRecord);
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
