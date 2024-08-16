import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws-v3';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { environment } from '@web-api/environment';

let searchClientCache: Client;
let searchClientInfoCache: Client;

export const getInfoSearchClient = () => {
  if (searchClientInfoCache) return searchClientInfoCache;
  if (environment.stage === 'local') {
    searchClientInfoCache = getLocalInfoSearchClient();
  } else {
    searchClientCache = getDeployedInfoSearchClient();
  }

  return searchClientCache;
};

// TODO 10432 This is a little noisy when running locally.
export const getLocalInfoSearchClient = (): Client => {
  return {
    index(...args) {
      console.log('System Performance Log: ', ...args);
    },
  } as Client;
};

export const getDeployedInfoSearchClient = (): Client => {
  return new Client({
    ...AwsSigv4Signer({
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
      region: 'us-east-1',
    }),
    node: `https://${environment.elasticsearchInfoEndpoint}:443`,
  });
};
