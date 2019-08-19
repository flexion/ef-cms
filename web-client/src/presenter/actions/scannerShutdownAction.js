import { state } from 'cerebral';

/**
 * removes third-party scanner scripts from the DOM and sets associated state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.scanner
 * @param {Function} providers.get the cerebral get helper function
 * @returns {void}
 */

export const scannerShutdownAction = ({ get, store }) => {
  const dynanScriptClass = get(state.scanner.dynanScriptClass);
  if (dynanScriptClass) {
    const injectedScripts = Array.from(
      document.getElementsByClassName(dynanScriptClass),
    );
    injectedScripts.forEach(scriptEl => scriptEl.remove());
  }
  store.set(state.scanner.initiateScriptLoaded, false);
  store.set(state.scanner.configScriptLoaded, false);
};
