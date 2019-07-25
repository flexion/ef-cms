import { state } from 'cerebral';

/**
 * injects third-party scanner scripts into the DOM and sets associated state
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner resource URI
 * @param {object} providers.store the cerebral store used for setting state.scanner
 */

export const scannerStartupAction = ({ applicationContext, store }) => {
  applicationContext.getScanner().loadDynamsoft({
    cb: dynanScriptClass => {
      store.set(state.scanner.dynanScriptClass, dynanScriptClass);
      store.set(state.scanner.initiateScriptLoaded, true);
      store.set(state.scanner.configScriptLoaded, true);
    },
  });
};
