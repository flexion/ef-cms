const AWS = require('aws-sdk');
const axios = require('axios');
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

type SequenceMetric = {
  eventName: string;
  duration: number;
};

type SequencePerformanceReportParams = {
  elasticSearchClient: any;
  httpClient: { post: (url: string, body: any, options: any) => Promise<void> };
  secretsManagerClient: {
    getSecretValue: (params: { SecretId: string }) => {
      promise: () => Promise<{ SecretString: string }>;
    };
  };
};

exports.handler = async () => {
  const { ELASTICSEARCH_INFO_ENDPOINT } = process.env;
  if (!ELASTICSEARCH_INFO_ENDPOINT) return;

  const elasticSearchClient = new Client({
    ...AwsSigv4Signer({
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
      region: 'us-east-1',
    }),
    node: `https://${ELASTICSEARCH_INFO_ENDPOINT}:443`,
  });

  await SequencePerformanceReport({
    elasticSearchClient,
    httpClient: axios,
    secretsManagerClient: secretsManager,
  });
};

async function getReportData(elasticSearchClient): Promise<SequenceMetric[]> {
  const index = 'system-performance-logs';
  const groupedMetrics = {};
  const DAYS = 7;

  let response = await elasticSearchClient.search({
    body: {
      query: {
        bool: {
          must: [
            { term: { category: 'sequence' } },
            {
              range: {
                date: {
                  gte: `now-${DAYS}d/d`,
                  lte: 'now',
                },
              },
            },
          ],
        },
      },
      size: 1000,
    },
    index,
    scroll: '2m',
  });

  let currentFetchResults = response.body.hits.hits;

  while (currentFetchResults.length > 0) {
    currentFetchResults.forEach(hit => {
      const { duration, eventName } = hit._source;
      if (!groupedMetrics[eventName]) {
        groupedMetrics[eventName] = { count: 0, totalDuration: 0 };
      }
      groupedMetrics[eventName].totalDuration += duration;
      groupedMetrics[eventName].count += 1;
    });

    response = await elasticSearchClient.scroll({
      scroll: '2m',
      scroll_id: response.body._scroll_id,
    });

    currentFetchResults = response.body.hits.hits;
  }

  const averages = Object.keys(groupedMetrics).map(eventName => {
    const { count, totalDuration } = groupedMetrics[eventName];
    return {
      duration: totalDuration / count,
      eventName,
    };
  });

  const SEQUENCE_COUNT = 10;
  return averages
    .sort((a, b) => b.duration - a.duration)
    .slice(0, SEQUENCE_COUNT);
}

function formatReprtData(REPORT_DATA: SequenceMetric[]): string {
  if (!REPORT_DATA.length) return 'No Sequence Performance Data';

  const REPORT_STRING: string = REPORT_DATA.reduce(
    (acc, currentMetric, index) => {
      const { duration, eventName } = currentMetric;
      const bulletNumber = index + 1;
      acc += `${bulletNumber.toString().padStart(2, '0')}.\t${eventName} (${duration} ms)\n`;
      return acc;
    },
    '',
  );

  return REPORT_STRING;
}

async function SequencePerformanceReport({
  elasticSearchClient,
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

  const REPORT_DATA: SequenceMetric[] =
    await getReportData(elasticSearchClient);

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
