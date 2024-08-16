const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

exports.handler = async () => await SequencePerformanceReport(secretsManager);

async function SequencePerformanceReport(secretsManagerClient) {
  const secretName = 'SLACK_WEBHOOK_URL';
  const SLACK_WEBHOOK_URL = await secretsManagerClient
    .getSecretValue({ SecretId: secretName })
    .promise()
    .catch(() => null);

  console.log('SLACK_WEBHOOK_URL', SLACK_WEBHOOK_URL);
}
