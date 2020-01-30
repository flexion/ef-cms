/**
 * validateDocketRecordInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketRecord the docket record to be validated
 * @returns {object} the validation errors or null
 */
exports.validateDocketRecordInteractor = ({
  applicationContext,
  docketRecord,
}) => {
  console.log('docketRecord', docketRecord);
  const errors = new (applicationContext.getEntityConstructors().DocketRecord)(
    docketRecord,
  ).getFormattedValidationErrors();

  return errors || null;
};
