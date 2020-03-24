import { state } from 'cerebral';

/**
 * changes the route to view the case-detail of the caseId of props.caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToCaseDetailAction = ({ get, props, router }) => {
  const caseId =
    props.caseId ||
    (props.caseDetail
      ? props.caseDetail.caseId
      : get(state.caseDetail.docketNumber));

  if (caseId) {
    // router.route(`/case-detail/${caseId}`);
    window.location = `/case-detail/${caseId}`;
    router.exec();
  }
};
