const axios = require('axios');

exports.associateRespondentToCase = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  const userToken = userId;

  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/respondents/${userId}/cases`,
    {
      caseId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
