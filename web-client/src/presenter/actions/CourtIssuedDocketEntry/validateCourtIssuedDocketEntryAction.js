import { state } from 'cerebral';

/**
 * validates the court-issued docket entry form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validation use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCourtIssuedDocketEntryAction = ({
  applicationContext,
  get,
  path,
}) => {
  const entryMetadata = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateCourtIssuedDocketEntryInteractor({
      applicationContext,
      entryMetadata,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'eventCode',
      'date',
      'judge',
      'freeText',
      'docketNumbers',
    ];

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
