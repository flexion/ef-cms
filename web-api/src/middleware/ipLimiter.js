const createApplicationContext = require('../applicationContext');

exports.ipLimiter = async (req, res, next) => {
  const MAX_COUNT = 15;
  const WINDOW_TIME = 60 * 1000;
  const applicationContext = createApplicationContext(null);
  const { sourceIp } = req.apiGateway.event.requestContext.identity;
  const KEY = `ip-limiter|${sourceIp}`;
  const results = await applicationContext
    .getPersistenceGateway()
    .incrementKeyCount({ applicationContext, key: KEY });

  const { expiresAt, id: count } = results;

  console.log({
    KEY,
    count,
    expiresAt,
  });

  console.log(!expiresAt || Date.now() > expiresAt);

  if (!expiresAt || Date.now() > expiresAt) {
    console.log('deleting key count');
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
