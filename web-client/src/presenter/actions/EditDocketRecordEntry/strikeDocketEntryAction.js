import { state } from 'cerebral';

/**
 * calls use case to strike a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 * @returns {Function} the next path in the sequence
 */
export const strikeDocketEntryAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { docketRecordId } = get(state.form);

  try {
    await applicationContext.getUseCases().strikeDocketEntryInteractor({
      applicationContext,
      docketNumber,
      docketRecordId,
    });
    return path.success();
  } catch (err) {
    return path.error({
      alertError: {
        message: err.message,
        title: 'Error',
      },
    });
  }
};
