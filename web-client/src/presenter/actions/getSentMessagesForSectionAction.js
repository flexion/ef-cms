/**
 * get the sent work items in a section.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getSentWorkItemsForSection use case
 * @returns {object} a list of sent work items
 */
export const getSentMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  let workItems = await applicationContext
    .getUseCases()
    .getSentMessageForSection({
      applicationContext,
      section: user.section,
    });
  return { workItems };
};
