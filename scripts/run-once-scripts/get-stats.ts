import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  GetMetricStatisticsCommandInput,
  Datapoint,
} from '@aws-sdk/client-cloudwatch';
import { DateTime } from 'luxon';

const getMetricStatistics = async ({
  namespace,
  metricName,
  dimensions,
  startTime,
  endTime,
  period,
  statistics,
  region,
}): Promise<Datapoint[]> => {
  const client = new CloudWatchClient({ region });
  const command = new GetMetricStatisticsCommand({
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: dimensions,
    StartTime: new Date(startTime),
    EndTime: new Date(endTime),
    Period: period,
    Statistics: statistics,
  } as GetMetricStatisticsCommandInput);

  const response = await client.send(command);
  return response.Datapoints || [];
};

const calculateTotalSum = (
  datapoints: Datapoint[],
  key: keyof Datapoint,
): number => {
  return datapoints.reduce((acc, dp) => acc + (dp[key] as number), 0);
};

const getMetricSum = async (
  instances: string[],
  regions: string[],
  getInstanceMetrics: (instance: string, region: string) => Promise<number>,
): Promise<number> => {
  let totalSum = 0;

  for (const region of regions) {
    for (const instance of instances) {
      const instanceSum = await getInstanceMetrics(instance, region);
      totalSum += instanceSum;
    }
  }

  return totalSum;
};

// Get API Gateway Total Requests per Second over the last month across multiple regions
const getTotalAverageApiGatewayRequests = async (
  apiNames: string[],
  regions: string[],
): Promise<number> => {
  const totalSum = await getMetricSum(
    apiNames,
    regions,
    async (apiName, region) => {
      const endTime = DateTime.utc().toISO();
      const startTime = DateTime.utc().minus({ months: 1 }).toISO(); // Last 1 month

      const datapoints = await getMetricStatistics({
        namespace: 'AWS/ApiGateway',
        metricName: 'Count',
        dimensions: [{ Name: 'ApiName', Value: apiName }],
        startTime,
        endTime,
        period: 3600, // 1 hour
        statistics: ['Sum'],
        region,
      });

      const totalRequests = calculateTotalSum(datapoints, 'Sum');
      const secondsInMonth = 30 * 24 * 60 * 60;

      // Requests/second
      return totalRequests / secondsInMonth;
    },
  );

  // Still requests/second
  return totalSum;
};

const getTotalAverageDynamoDBTransactions = async (
  tableNames: string[],
  regions: string[],
): Promise<number> => {
  const totalSum = await getMetricSum(
    tableNames,
    regions,
    async (tableName, region) => {
      const endTime = DateTime.utc().toISO();
      const startTime = DateTime.utc().minus({ months: 3 }).toISO();

      const datapoints = await getMetricStatistics({
        namespace: 'AWS/DynamoDB',
        metricName: 'ConsumedWriteCapacityUnits',
        dimensions: [{ Name: 'TableName', Value: tableName }],
        startTime,
        endTime,
        period: 86400, // 1 day
        statistics: ['Sum'],
        region,
      });

      return calculateTotalSum(datapoints, 'Sum');
    },
  );

  // Average/month
  return totalSum / 3;
};

const getTotalAverageLambdaEvents = async (
  functionNames: string[],
  regions: string[],
): Promise<number> => {
  const totalSum = await getMetricSum(
    functionNames,
    regions,
    async (functionName, region) => {
      const endTime = DateTime.utc().toISO();
      const startTime = DateTime.utc().minus({ months: 3 }).toISO();

      const datapoints = await getMetricStatistics({
        namespace: 'AWS/Lambda',
        metricName: 'Invocations',
        dimensions: [{ Name: 'FunctionName', Value: functionName }],
        startTime,
        endTime,
        period: 86400, // 1 day
        statistics: ['Sum'],
        region,
      });

      return calculateTotalSum(datapoints, 'Sum');
    },
  );

  // Average/month
  return totalSum / 3;
};

const env = process.argv[2];

const apiGatewayNames = [
  `gateway_api_public_${env}_blue`,
  `gateway_api_public_${env}_green`,
  `gateway_api_${env}_blue`,
  `gateway_api_${env}_green`,
  `websocket_api_${env}_blue`,
  `websocket_api_${env}_green`,
];
const dynamoDBTableNames = [
  `efcms-deploy-${env}`,
  `efcms-${env}-alpha`,
  `efcms-${env}-beta`,
];
const lambdaFunctionNames = [
  `api_${env}_green`,
  `api_${env}_blue`,
  `api_public_${env}_green`,
  `api_public_${env}_blue`,
  `api_async_${env}_green`,
  `api_async_${env}_blue`,
  `change_of_address_${env}_green`,
  `change_of_address_${env}_blue`,
  `worker_lambda_${env}_green`,
  `worker_lambda_${env}_blue`,
  `check_case_cron_${env}_green`,
  `check_case_cron_${env}_blue`,
  `send_emails_${env}_blue`,
  `send_emails_${env}_green`,
  `set_trial_session_${env}_green`,
  `set_trial_session_${env}_blue`,
  `pdf_generator_${env}_blue`,
  `pdf_generator_${env}_green`,
  // websocket lambdas?
  // so many more...
];

const regions = ['us-east-1', 'us-west-2'];

(async () => {
  const totalAverageApiRequestsPerSecond =
    await getTotalAverageApiGatewayRequests(apiGatewayNames, regions);
  const totalAverageDynamoDBTransactions =
    await getTotalAverageDynamoDBTransactions(dynamoDBTableNames, regions);
  const totalAverageLambdaEvents = await getTotalAverageLambdaEvents(
    lambdaFunctionNames,
    regions,
  );

  console.log(
    `Total Average API Gateway Requests per Second (last month) across regions for ${env}:`,
    totalAverageApiRequestsPerSecond,
  );
  console.log(
    `Total Average DynamoDB Monthly Transaction Volume (last 3 months) across regions for ${env}:`,
    totalAverageDynamoDBTransactions,
  );
  console.log(
    `Total Average Lambda Events per Month (last 3 months) across regions for ${env}:`,
    totalAverageLambdaEvents,
  );
})();
