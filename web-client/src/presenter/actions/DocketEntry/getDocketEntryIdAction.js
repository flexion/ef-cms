import { state } from 'cerebral';

/**
 * Get the ID of the docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {String} ID of the docket entry
 */
export const getDocketEntryIdAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { primaryDocumentFileId } = props;
  const isEditingDocketEntry = get(state.isEditingDocketEntry);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  let docketEntryId;

  if (isEditingDocketEntry) {
    docketEntryId = get(state.docketEntryId);
  } else if (isFileAttached) {
    docketEntryId = primaryDocumentFileId;
  } else {
    docketEntryId = applicationContext.getUniqueId();
  }

  return { docketEntryId };
};
