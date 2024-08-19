const AWS = require('aws-sdk');
const axios = require('axios');
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
//web-api/src/lambdas
exports.handler = async () =>
  await SequencePerformanceReport({
    httpClient: axios,
    secretsManagerClient: secretsManager,
  });

async function getReportData() {
  return await new Promise(resolve => resolve('John is the BEST!!!!'));
}

async function SequencePerformanceReport({ httpClient, secretsManagerClient }) {
  const { STAGE } = process.env;
  if (!STAGE) return;

  const secretName = `SLACK_WEBHOOK_URL_${STAGE}`;
  const SLACK_WEBHOOK_URL = await secretsManagerClient
    .getSecretValue({ SecretId: secretName })
    .promise()
    .then(data => JSON.parse(data.SecretString))
    .then(secrets => secrets[secretName])
    .catch(error => {
      console.log('**ERROR GETTING SECRET -> ', error);
      return error;
    });

  if (!SLACK_WEBHOOK_URL) return;

  const REPORT_DATA = await getReportData();
  const BODY = { text: REPORT_DATA };
  const OPTIONS = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await httpClient.post(SLACK_WEBHOOK_URL, BODY, OPTIONS).catch(error => {
    console.log('**ERROR POSTING REPORT TO SLACK -> ', error);
    return error;
  });
}
