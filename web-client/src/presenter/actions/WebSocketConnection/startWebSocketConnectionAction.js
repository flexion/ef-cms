/**
 * startWebSocketConnectionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.socket the socket object
 * @returns {Promise<*>} the success or error path
 */
export const startWebSocketConnectionAction = async ({
  applicationContext,
  path,
  socket,
}) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();

  if (user.role === USER_ROLES.irsPractitioner) {
    return path.success();
  }

  try {
    await socket.start();
    return path.success();
  } catch {
    return path.error();
  }
};
