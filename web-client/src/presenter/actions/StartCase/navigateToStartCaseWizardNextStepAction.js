import { state } from 'cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 */
export const navigateToStartCaseWizardNextStepAction = ({
  props,
  router,
  store,
}) => {
  const { nextStep } = props;
  store.set(state.wizardStep, `StartCaseStep${nextStep}`);
  router.route(`/start-a-case-wizard/step-${nextStep}`);
};
