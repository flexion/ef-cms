const User = require('../entities/User');

const {
  isAuthorized,
  WORKITEM,
} = require('../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../errors/errors');

/**
 * getInternalUsers
 * @param sectionType
 * @returns {Promise<User[]>}
 */
exports.getInternalUsers = async ({ applicationContext }) => {
  if (!isAuthorized(applicationContext.getCurrentUser(), WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // TODO: fix this
  return User.validateRawCollection([
    // new User({ userId: 'docketclerk' }).toRawObject(),
    // new User({ userId: 'docketclerk1' }).toRawObject(),
    // new User({ userId: 'seniorattorney' }).toRawObject(),
  ]);
};
