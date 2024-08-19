const AWS = require('aws-sdk');
const axios = require('axios');
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });

exports.handler = async () =>
  await SequencePerformanceReport({
    httpClient: axios,
    secretsManagerClient: secretsManager,
  });

async function getReportData(): Promise<SequenceMetric[]> {
  const TEMP_DATA: SequenceMetric[] = [];
  for (let index = 0; index < 5; index++) {
    TEMP_DATA.push({
      duration: Math.floor(Math.random() * 100),
      sequenceName: `sequenceName${index + 1}`,
    });
  }

  TEMP_DATA.sort((a, b) => b.duration - a.duration);
  return await new Promise(resolve => resolve(TEMP_DATA));
}

function formatReprtData(REPORT_DATA: SequenceMetric[]): string {
  const REPORT_STRING: string = REPORT_DATA.reduce(
    (acc, currentMetric, index) => {
      const { duration, sequenceName } = currentMetric;
      acc += `${index + 1}.\t${sequenceName} (${duration} seconds)\n`;
      return acc;
    },
    '',
  );

  return REPORT_STRING;
}

type SequenceMetric = {
  sequenceName: string;
  duration: number;
};

type SequencePerformanceReportParams = {
  httpClient: { post: (url: string, body: any, options: any) => Promise<void> };
  secretsManagerClient: {
    getSecretValue: (params: { SecretId: string }) => {
      promise: () => Promise<{ SecretString: string }>;
    };
  };
};

async function SequencePerformanceReport({
  httpClient,
  secretsManagerClient,
}: SequencePerformanceReportParams) {
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

  const REPORT_DATA: SequenceMetric[] = await getReportData();
  const REPORT_STRING: string = formatReprtData(REPORT_DATA);

  const BODY = {
    blocks: [
      {
        text: {
          text: `:bar_chart: *_Weekly Sequence Performance Report (${STAGE.toUpperCase()})_* :bar_chart:`,
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: REPORT_STRING,
          type: 'mrkdwn',
        },
        type: 'section',
      },
    ],
  };

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
