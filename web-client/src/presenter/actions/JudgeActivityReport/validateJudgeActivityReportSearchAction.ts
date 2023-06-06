import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { state } from 'cerebral';

/**
 * Validates the judge activity report search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateJudgeActivityReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const errors = new JudgeActivityReportSearch({
    endDate,
    judgeName,
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
