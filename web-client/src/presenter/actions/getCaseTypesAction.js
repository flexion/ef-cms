import { state } from 'cerebral';

/**
 *  Gets a list of the types of cases, such as Deficiency, Innocent Spouse, etc
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCaseTypes use case
 * @param {Functionn} providers.get the cerebral get function used for getting state.user.userId
 * @returns {Object} contains the caseTypes array returned from the getCaseTypes use case
 */
export default async ({ applicationContext, get }) => {
  const caseTypes = await applicationContext.getUseCases().getCaseTypes({
    userId: get(state.user.userId),
  });
  return { caseTypes };
};
