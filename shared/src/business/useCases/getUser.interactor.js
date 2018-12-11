const User = require('../entities/User');
/**
 * getUser
 * @param userId
 * @returns {User}
 */
exports.getUser = async userId => {
  return new User({ userId });
};
