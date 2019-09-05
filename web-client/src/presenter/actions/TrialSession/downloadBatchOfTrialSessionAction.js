const sanitize = require('sanitize-filename');

/**
 * downloadBatchOfTrialSessionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the zipFile
 */
export const downloadBatchOfTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  const { caseDetails, trialSession, trialSessionId } = props;

  const result = await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor({
      applicationContext,
      caseDetails,
      trialSessionId,
    });

  const trialDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMMM_D_YYYY');
  const { trialLocation } = trialSession;
  let zipName = sanitize(`${trialDate}-${trialLocation}.zip`)
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  var windowUrl = window.URL || window.webkitURL;
  var url = windowUrl.createObjectURL(result);
  var anchor = document.createElement('a');
  anchor.style = 'display: none';
  document.body.appendChild(anchor);
  anchor.href = url;
  anchor.download = zipName;
  anchor.click();
  anchor.parentNode.removeChild(anchor);
  windowUrl.revokeObjectURL(url);
};
