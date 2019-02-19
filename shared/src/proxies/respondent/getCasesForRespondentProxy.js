/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesForRespondent = async ({ applicationContext, userId }) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
