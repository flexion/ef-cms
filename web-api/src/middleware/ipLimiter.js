exports.ipLimiter =
  ({ applicationContext, key }) =>
  async (req, res, next) => {
    const MAX_COUNT = parseInt(process.env.IP_LIMITER_THRESHOLD ?? '15');
    const WINDOW_TIME = parseInt(
      process.env.IP_LIMITER_WINDOW ?? `${60 * 1000}`,
    );
    const { sourceIp } = req.apiGateway.event.requestContext.identity;
    const KEY = `ip-limiter-${key}|${sourceIp}`;

    const limiterCache = await applicationContext
      .getPersistenceGateway()
      .incrementKeyCount({ applicationContext, key: KEY });

    let { expiresAt, id: count } = limiterCache;

    if (!expiresAt || Date.now() > expiresAt) {
      await applicationContext
        .getPersistenceGateway()
        .deleteKeyCount({ applicationContext, key: KEY });

      await applicationContext.getPersistenceGateway().setExpiresAt({
        applicationContext,
        expiresAt: Date.now() + WINDOW_TIME,
        key: KEY,
      });

      count = 1;
    }

    if (count > MAX_COUNT) {
      return res
        .set('Retry-After', WINDOW_TIME)
        .status(429)
        .json({
          message: `you are only allowed ${MAX_COUNT} requests a minute`,
        });
    }

    next();
  };
