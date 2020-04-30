const { ApiGatewayV2 } = require('aws-sdk');

exports.getApiGateway = ({ environment }) => {
  const apiGateway = new ApiGatewayV2({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return apiGateway;
};
