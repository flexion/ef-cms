/**
 * Determine if the work item from props has already been completed
 *
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.path the cerebral path function
 * @returns {object} the list of section work items
 */
export const isWorkItemAlreadyCompletedAction = ({ path, props }) => {
  // const caseDetail = get(state.caseDetail);
  // const docketEntryId = get(state.docketEntryId);

  // const { workItem } = caseDetail.docketEntries.find(
  //   entry => entry.docketEntryId === docketEntryId,
  // );
  const { workItem } = props;

  if (workItem?.completedAt) {
    return path.yes();
  } else {
    return path.no();
  }
};
