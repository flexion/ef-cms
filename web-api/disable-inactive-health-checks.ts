import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  Route53Client,
  UpdateHealthCheckCommand,
} from '@aws-sdk/client-route-53';
import { UpdateHealthCheckRequest } from 'aws-sdk/clients/route53';

const check = (value: string | undefined, message: string) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { DEPLOYING_COLOR, ENV } = process.env;

check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(ENV, 'You must have ENV set in your environment');

async function main() {
  const ssmClient = new SSMClient({});

  const ssmCommand = new GetParametersCommand({
    Names: [
      `${ENV}-${DEPLOYING_COLOR}-us-east-1-health-check-id`,
      `${ENV}-${DEPLOYING_COLOR}-us-west-1-health-check-id`,
    ],
  });
  const ssmResponse = await ssmClient.send(ssmCommand);
  console.log('ssmResponse', ssmResponse);

  const healthCheckIds: string[] = ssmResponse.Parameters!.map(param => {
    return param.Value!;
  });

  const client = new Route53Client({});

  for (let id in healthCheckIds) {
    const input: UpdateHealthCheckRequest = {
      Disabled: true,
      HealthCheckId: id,
    };

    const command = new UpdateHealthCheckCommand(input);
    const response = await client.send(command);
    console.log('Response: ', response);
  }
}

main();
