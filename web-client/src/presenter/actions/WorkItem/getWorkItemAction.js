import { state } from 'cerebral';

/**
 * Get work item by id from persistence
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.path the cerebral path function
 * @returns {object} the list of section work items
 */
export const getWorkItemAction = async ({ applicationContext, get }) => {
  const docketEntryIdOfInterest = get(state.docketEntryId);
  const { docketEntries } = get(state.caseDetail);

  const { workItem: workItemOfInterest } = docketEntries.find(
    d => d.docketEntryId === docketEntryIdOfInterest,
  );

  const workItem = await applicationContext
    .getUseCases()
    .getWorkItemInteractor(applicationContext, {
      workItemId: workItemOfInterest.workItemId,
    });

  return { workItem };
};
