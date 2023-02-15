import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';

exports.getCloudWatch = ({ environment }) => {
  const cloudWatch = new CloudWatchLogsClient({
    apiVersion: 'latest',
    region: environment.region,
  });

  return cloudWatch;
};
