const createApplicationContext = require('../../src/applicationContext');
const applicationContext = createApplicationContext({});
const { scanMessages } = require('./worker.helper');

const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  handleMessage: async message => {
    // any errors thrown here will be left in the sqs queue
    await scanMessages({
      applicationContext,
      messages: [message],
    });
  },
  queueUrl: applicationContext.environment.virusScanQueueUrl,
});

app.on('error', err => {
  applicationContext.logger.error('Failed to scan', err);
});

app.on('processing_error', err => {
  applicationContext.logger.error('Failed to process the scan event', err);
});

applicationContext.logger.info('ClamAV listener started');
app.start();
