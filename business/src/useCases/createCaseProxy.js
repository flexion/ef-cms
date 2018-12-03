const axios = require('axios');

/**
 * createCaseProxy
 *
 * @param userId
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = async ({ userId, documents, applicationContext }) => {
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      documents,
    },
    {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    },
  );
  return response.data;
};
