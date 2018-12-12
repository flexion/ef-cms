const axios = require('axios');

exports.associateAnswerToCase = async ({
  applicationContext,
  caseId,
  userId,
  answer,
}) => {
  const userToken = userId;

  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/answer`,
    answer,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
