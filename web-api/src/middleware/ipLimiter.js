const createApplicationContext = require('../applicationContext');

exports.ipLimiter = async (req, res, next) => {
  const MAX_COUNT = 15;
  const WINDOW_TIME = 60 * 1000;
  const applicationContext = createApplicationContext(null);
  const { sourceIp } = req.apiGateway.event.requestContext.identity;
  const KEY = `ip-limiter|${sourceIp}`;

  const limiterCache = await applicationContext
    .getPersistenceGateway()
    .incrementKeyCount({ applicationContext, key: KEY });

  const { expiresAt, id: count } = limiterCache;

  if (!expiresAt || Date.now() > expiresAt) {
    await applicationContext
      .getPersistenceGateway()
      .deleteKeyCount({ applicationContext, key: KEY });

    await applicationContext.getPersistenceGateway().setExpiresAt({
      applicationContext,
      expiresAt: Date.now() + WINDOW_TIME,
      key: KEY,
    });
  }

  if (count >= MAX_COUNT) {
    return res.status(429).json({
      message: `you are only allowed ${MAX_COUNT} requests a minute`,
    });
  }

  next();
};
