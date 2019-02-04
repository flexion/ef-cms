import clearAlerts from '../actions/clearAlertsAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import recallPetitionFromIRSHoldingQueue from '../actions/sendPetitionToIRSHoldingQueueAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import clearModal from '../actions/clearModalAction';

export default [
  clearAlerts,
  clearModal,
  recallPetitionFromIRSHoldingQueue,
  setAlertSuccess,
  navigateToDashboard,
];
