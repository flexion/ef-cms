exports.recallPetitionFromIRSHoldingQueue = async ({
  caseId,
  applicationContext,
}) => {
  const userToken = applicationContext.getCurrentUser().userId; //TODO refactor for jwt

  const response = await applicationContext.getHttpClient().delete(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/irsPetitionPackage`,
    null, // don't send a body
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
