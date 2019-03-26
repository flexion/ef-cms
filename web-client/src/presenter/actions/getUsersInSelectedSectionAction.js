/**
 * returns a callback function scoped to a section the users in a section
 *
 * @param {string} section the section to fetch users from
 * @returns {Function} a function which should fetch the users in that section
 */
export const getUsersInSelectedSectionAction = async ({
  applicationContext,
  props,
}) => {
  if (!props.section) {
    return {
      users: [],
    };
  }
  const users = await applicationContext
    .getUseCases()
    .getUsersInSection({ applicationContext, section: props.section });
  return {
    users,
  };
};
