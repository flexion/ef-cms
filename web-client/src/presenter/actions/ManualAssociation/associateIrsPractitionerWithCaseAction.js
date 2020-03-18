import { state } from 'cerebral';

/**
 * associates a respondent with case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const associateIrsPractitionerWithCaseAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const userId = get(state.modal.user.userId);
  const serviceIndicator = get(state.modal.serviceIndicator);
  const caseId = get(state.caseDetail.caseId);

  console.log('caseId', caseId);
  console.log('userId', userId);
  console.log('serviceIndicator', serviceIndicator);

  const result = await applicationContext
    .getUseCases()
    .associateIrsPractitionerWithCaseInteractor({
      applicationContext,
      caseId,
      serviceIndicator,
      userId,
    });

  console.log('associate irs practitioner with case result', result);

  return path.success({
    alertSuccess: {
      message: 'You can view Respondent details below.',
      title: 'Respondent has been added to this case.',
    },
  });
};
