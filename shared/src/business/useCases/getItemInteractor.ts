import { ClientApplicationContext } from '@web-client/applicationContext';

/**
 *
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key to retrieve
 * @returns {object} the item
 */
export const getItemInteractor = (
  applicationContext: ClientApplicationContext, // any until we refactor the client
  { key }: { key: string },
) => {
  return applicationContext.getPersistenceGateway().getItem({
    key,
  });
};
