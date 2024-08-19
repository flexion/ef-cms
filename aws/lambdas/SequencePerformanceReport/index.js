const AWS = require('aws-sdk');
const axios = require('axios');
const secretsManager = new AWS.SecretsManager();

exports.handler = async () =>
  await SequencePerformanceReport({
    httpClient: axios,
    secretsManagerClient: secretsManager,
  });

async function getReportData() {
  return await new Promise(resolve => resolve('John is TESTING'));
}

async function SequencePerformanceReport({ httpClient, secretsManagerClient }) {
  const secretName = 'SLACK_WEBHOOK_URL';
  const SLACK_WEBHOOK_URL = await secretsManagerClient
    .getSecretValue({ SecretId: secretName })
    .promise()
    .catch(() => null);

  if (!SLACK_WEBHOOK_URL) return;

  const REPORT_DATA = await getReportData();
  const BODY = { text: REPORT_DATA };
  const OPTIONS = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('GOING TO POST REPORT TO SLACK');
  await httpClient.post(SLACK_WEBHOOK_URL, BODY, OPTIONS).catch(() => null);
}
