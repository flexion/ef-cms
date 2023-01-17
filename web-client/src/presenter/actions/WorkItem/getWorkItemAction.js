import { state } from 'cerebral';

/**
 * Get work item by id from persistence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} work item
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
