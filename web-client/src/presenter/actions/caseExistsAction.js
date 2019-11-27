/**
 * Checks for existence of a case using the getCase use case using the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.path provides execution path choices depending on success of search
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const caseExistsAction = async ({ applicationContext, path, props }) => {
  try {
    await applicationContext.getUseCases().getPublicCaseInteractor({
      applicationContext,
      docketNumber: props.caseId,
    });
    return path.success();
  } catch (e) {
    return path.error();
  }
};
