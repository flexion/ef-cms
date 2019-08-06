import { state } from 'cerebral';

/**
 * initiates a rescan session for the given batch
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function getting state
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object used for getting the props.scannerSourceIndex
 * @param {object} providers.store the cerebral store used for setting the scan state
 * @returns {void}
 */

export const rescanBatchAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  store.set(state.isScanning, true);
  store.set(state.submitting, true);
  const batchIndex = get(state.batchIndexToRescan);
  const scanner = applicationContext.getScanner();
  scanner.setSourceByIndex(props.scannerSourceIndex);

  try {
    const { scannedBuffer: pages } = await scanner.startScanSession({
      applicationContext,
    });
    const documentSelectedForScan = get(state.documentSelectedForScan);
    const batches = get(state.batches[documentSelectedForScan]);
    batches.find(b => b.index === batchIndex).pages = pages;
    store.set(state.batches[documentSelectedForScan], batches);
    store.set(state.submitting, false);
    store.set(state.isScanning, false);
    store.set(state.selectedBatchIndex, batchIndex);
    return path.success();
  } catch (err) {
    return path.error({ error: err });
  }
};
