(async () => {
  const {
    elasticsearchIndexes,
  } = require('./elasticsearch/elasticsearch-indexes');
  const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
  const { Client } = require('@opensearch-project/opensearch');
  const { defaultProvider } = require('@aws-sdk/credential-provider-node');

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: 'us-east-1',
  };

  const openSearchClient = new Client({
    ...AwsSigv4Signer({
      getCredentials: () => {
        const credentialsProvider = defaultProvider({
          httpOptions: {
            timeout: 300000,
          },
        });
        return credentialsProvider();
      },

      region: 'us-east-1',
    }),
    node: `https://${environment.elasticsearchEndpoint}:443`,
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const indexExists = await openSearchClient.indices.exists({
          body: {},
          index,
        });
        if (indexExists) {
          openSearchClient.indices.delete({
            index,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
})();
