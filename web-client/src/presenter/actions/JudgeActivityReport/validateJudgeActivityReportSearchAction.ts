import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const validateJudgeActivityReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const errors = new JudgeActivityReportSearch({
    endDate,
    judgesSelection,
    startDate,
  }).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }

  return path.success();
};
