const { getApiGateway } = require('./getApiGateway');
const { getCustomDomains } = require('./getCustomDomains');
const { sleepForMilliseconds } = require('./sleep');
import { DeleteDomainNameCommand } from '@aws-sdk/client-apigatewayv2';

exports.deleteCustomDomains = async ({ environment }) => {
  const apiGateway = getApiGateway({ environment });

  const customDomains = await getCustomDomains({
    apiGateway,
    environment,
  });

  for (const domain of customDomains) {
    console.log('Delete Custom Domain:', domain.DomainName);
    const command = new DeleteDomainNameCommand({
      DomainName: domain.DomainName,
    });
    await apiGateway.send(command);

    await sleepForMilliseconds(100);
  }
};
