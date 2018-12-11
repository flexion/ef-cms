const Case = require('../entities/Case');

exports.getCases = async ({ userId, status, applicationContext }) => {
  const user = await applicationContext.getUseCases().getUser(userId);

  let cases;
  switch (user.role) {
    case 'taxpayer':
      cases = await applicationContext
        .getUseCases()
        .getCasesByUser({ userId, applicationContext });
      break;
    case 'respondent':
      cases = await applicationContext.getUseCases().getCasesForRespondent({
        respondentId: user.barNumber,
        applicationContext,
      });
      break;
    case 'petitionsclerk':
    case 'intakeclerk':
      if (!status) status = 'new';
      cases = await applicationContext
        .getUseCases()
        .getCasesByStatus({ status, userId, applicationContext });
      break;
    default:
      throw new Error('invalid user role');
  }
  return Case.validateRawCollection(cases);
};
