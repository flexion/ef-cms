import { CaseDeadline } from '../../../../shared/src/business/entities/CaseDeadline';
import { createCaseDeadline } from '@web-api/persistence/postgres/caseDeadlines/createCaseDeadline';

export const autoGenerateDeadline = async ({
  deadlineDate,
  description,
  subjectCaseEntity,
}) => {
  const newCaseDeadline = new CaseDeadline({
    associatedJudge: subjectCaseEntity.associatedJudge,
    associatedJudgeId: subjectCaseEntity.associatedJudgeId,
    deadlineDate,
    description,
    docketNumber: subjectCaseEntity.docketNumber,
    sortableDocketNumber: subjectCaseEntity.sortableDocketNumber,
  });

  await createCaseDeadline({
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });
};
