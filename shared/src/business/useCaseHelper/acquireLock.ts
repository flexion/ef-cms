export const checkLock = async ({
  applicationContext,
  identifier,
  onLockError,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  onLockError: Error;
  prefix: string;
}) => {
  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, identifier, prefix });

  if (currentLock) {
    applicationContext.logger.warn('Entity is currently locked', {
      currentLock,
    });
    throw onLockError;
  }
};

export const acquireLock = async ({
  applicationContext,
  identifier,
  onLockError,
  prefix,
  ttl = 30,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
  prefix: string;
  onLockError: Error;
  ttl?: number;
}) => {
  const identifiersToLock =
    typeof identifier === 'string' ? [identifier] : identifier;

  // First check if any are already locked, if so throw an error
  await Promise.all(
    identifiersToLock.map(entityIdentifier =>
      checkLock({
        applicationContext,
        identifier: entityIdentifier,
        onLockError,
        prefix,
      }),
    ),
  );

  // Second, lock them up so the are unavailable
  await Promise.all(
    identifiersToLock.map(entityIdentifier =>
      applicationContext.getPersistenceGateway().createLock({
        applicationContext,
        identifier: entityIdentifier,
        prefix,
        ttl,
      }),
    ),
  );
};

export const removeLock = ({
  applicationContext,
  identifier,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
  prefix: string;
}) => {
  if (typeof identifier === 'object') {
    return Promise.all(
      identifier.map(entityIdentifier =>
        removeLock({
          applicationContext,
          identifier: entityIdentifier,
          prefix,
        }),
      ),
    );
  }

  return applicationContext
    .getPersistenceGateway()
    .removeLock({ applicationContext, identifier, prefix });
};

/**
 * will wrap a function with logic to acquire a lock and delete a lock after finishing.
 *
 * @param {function} cb the original function to wrap
 * @param {function} getLockInfo a function which is passes the original args for getting the lock suffix
 * @param {error} onLockError the error object to throw if a lock is already in use
 * @returns {object} the item that was retrieved
 */
export function withLocking(
  cb: (applicationContext: IApplicationContext, options: any) => any,
  getLockInfo,
  onLockError,
) {
  return async function (
    applicationContext: IApplicationContext,
    options: any,
  ) {
    const { identifier, prefix, ttl } = getLockInfo(options);

    await acquireLock({
      applicationContext,
      identifier,
      onLockError,
      prefix,
      ttl,
    });

    let caughtError;
    let results;
    try {
      results = await cb(applicationContext, options);
    } catch (err) {
      caughtError = err;
    }

    await removeLock({
      applicationContext,
      identifier,
      prefix,
    });

    if (caughtError) {
      throw caughtError;
    }
    return results;
  };
}
