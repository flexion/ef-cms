import { state } from 'cerebral';

export const scanHelper = get => {
  // Master switch for the time being
  const scanFeatureEnabled = true;

  const internalRoles = ['petitionsclerk', 'docketclerk', 'seniorattorney'];
  const user = get(state.user);
  const initiateScriptLoaded = get(state.scanner.initiateScriptLoaded);
  const configScriptLoaded = get(state.scanner.configScriptLoaded);
  const petitionFileCompleted = !!get(state.form.petitionFile);
  const osdFileCompleted = !!get(state.form.ownershipDisclosureFile);
  const stinFileCompleted = !!get(state.form.stinFile);
  const requestForPlaceOfTrialFileCompleted = !!get(
    state.form.requestForPlaceOfTrialFile,
  );

  return {
    hasLoadedScanDependencies: initiateScriptLoaded && configScriptLoaded,
    hasScanFeature: !!(user && user.role && internalRoles.includes(user.role)),
    osdFileCompleted,
    petitionFileCompleted,
    requestForPlaceOfTrialFileCompleted,
    scanFeatureEnabled,
    showScannerSourceModal: get(state.showModal) === 'SelectScannerSourceModal',
    sources: get(state.scanner.sources),
    stinFileCompleted,
  };
};
