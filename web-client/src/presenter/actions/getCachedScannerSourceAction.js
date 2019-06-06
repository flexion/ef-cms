/**
 * gets the scanner source name from local storage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for accessing local storage
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {string} the scanner source name from local storage
 */
export const getCachedScannerSourceAction = async ({
  applicationContext,
  path,
}) => {
  const scannerSourceName = await applicationContext
    .getPersistenceGateway()
    .getItem({
      applicationContext,
      key: 'scannerSourceName',
    });

  if (scannerSourceName) {
    return path.success({
      scannerSourceName,
    });
  } else {
    return path.selectSource();
  }
};
