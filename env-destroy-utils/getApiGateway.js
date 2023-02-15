import { ApiGatewayV2Client } from '@aws-sdk/client-apigatewayv2';

exports.getApiGateway = ({ environment }) => {
  const apiGateway = new ApiGatewayV2Client({
    apiVersion: 'latest',
    maxRetries: 20,
    region: environment.region,
  });

  return apiGateway;
};
