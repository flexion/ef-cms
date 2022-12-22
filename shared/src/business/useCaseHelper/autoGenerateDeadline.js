const { CaseDeadline } = require('../entities/CaseDeadline');

exports.autoGenerateDeadline = async ({
  applicationContext,
  deadlineDate,
  description,
  subjectCaseEntity,
}) => {
  const newCaseDeadline = new CaseDeadline(
    {
      associatedJudge: subjectCaseEntity.associatedJudge,
      deadlineDate,
      description,
      docketNumber: subjectCaseEntity.docketNumber,
      sortableDocketNumber: subjectCaseEntity.sortableDocketNumber,
    },
    {
      applicationContext,
    },
  );

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });
};
