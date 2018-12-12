const axios = require('axios');

exports.associateRespondentToCase = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  const userToken = userId;

  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/respondent`,
    {
      userId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
