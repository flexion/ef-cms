const createApplicationContext = require('../../src/applicationContext');
const applicationContext = createApplicationContext({});
const { scanMessages } = require('./worker.helper');

const main = () => {
  applicationContext.logger.info('ClamAV listener started');
  setTimeout(async function () {
    applicationContext.logger.info('Getting messages');
    const messages = await applicationContext
      .getPersistenceGateway()
      .getMessages({
        appContext: applicationContext,
      });
    applicationContext.logger.info(messages.length + ' messages found');
    await scanMessages({ appContext: applicationContext, messages });
  }, 10 * 1000);
};

main();
