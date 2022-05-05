const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

/**
 * getJudgeForUserChambersInteractor - returns the judge user for a given user in a chambers section
 *
 * @param {object} applicationContext the application context
 * @param {object} obj the options argument
 * @param {string} obj.section the section to fetch the judge from
 * @returns {User} the judge user for the given chambers user
 */

exports.getJudgeInSectionHelper = async (applicationContext, { section }) => {
  const rawUsers = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section,
    });

  const sectionUsers = User.validateRawCollection(rawUsers, {
    applicationContext,
  });

  const judgeUser = sectionUsers.find(
    sectionUser => sectionUser.role === ROLES.judge,
  );

  return judgeUser;
};
