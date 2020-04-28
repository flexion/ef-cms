import { state } from 'cerebral';

/**
 * gets the associated judge for the current user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {object} Associated Judge user object if found
 */
export const getJudgeForCurrentUserAction = async ({
  applicationContext,
  get,
}) => {
  const user = applicationContext.getCurrentUser();

  const { USER_ROLES } = get(state.constants);

  let judgeUser;
  if (user.role === USER_ROLES.judge) {
    judgeUser = user;
  } else if (user.role === USER_ROLES.chambers) {
    let chambersSection;
    if (user.section) {
      chambersSection = user.section;
    } else {
      const chamberUser = await applicationContext
        .getUseCases()
        .getUserInteractor({ applicationContext });
      chambersSection = chamberUser.section;
    }

    const sectionUsers = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor({
        applicationContext,
        section: chambersSection,
      });

    judgeUser = sectionUsers.find(user => user.role === USER_ROLES.judge);
  }

  if (judgeUser) {
    return { judgeUser };
  }
};
