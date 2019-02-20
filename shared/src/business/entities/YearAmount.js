const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

/**
 *
 * @param yearAmount
 * @constructor
 */
function YearAmount(yearAmount) {
  Object.assign(this, yearAmount);
}

joiValidationDecorator(
  YearAmount,
  joi.object().keys({
    year: joi
      .date()
      .max('now')
      .iso()
      .required(),
    amount: joi
      .number()
      .allow(null)
      .greater(0)
      .integer()
      .optional(),
  }),
  () => true,
  {
    year: [
      {
        contains: 'must be less than or equal to',
        message: 'That year is in the future. Please enter a valid year.',
      },
      'Please enter a valid year.',
    ],
    amount: 'Please enter a valid amount.',
  },
);

module.exports = YearAmount;
