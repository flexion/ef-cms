import { state } from 'cerebral';

/**
 * combines the caseOrder of the state.trailSession onto the state.trialSession.calendaredCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.calendaredCases
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const mergeCaseOrderIntoCalendaredCasesAction = ({ get, store }) => {
  const { caseOrder } = get(state.trialSession);
  const { calendaredCases } = get(state.trialSession);

  for (const calendaredCase of calendaredCases) {
    const order = caseOrder.find(o => o.caseId === calendaredCase.caseId);
    Object.assign(calendaredCase, order);
  }

  store.set(state.trialSession.calendaredCases, calendaredCases);
};
