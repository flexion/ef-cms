const { getDynamoEndpoints } = require('./getDynamoEndpoints');

const fallbackHandler = ({
  fallbackRegion,
  fallbackRegionEndpoint,
  key,
  mainRegion,
  mainRegionEndpoint,
  masterDynamoDbEndpoint,
  masterRegion,
  useMasterRegion,
}) => {
  const { fallbackRegionDB, mainRegionDB } = getDynamoEndpoints({
    fallbackRegion,
    fallbackRegionEndpoint,
    key,
    mainRegion,
    mainRegionEndpoint,
    masterDynamoDbEndpoint,
    masterRegion,
    useMasterRegion,
  });

  return params =>
    new Promise((resolve, reject) => {
      console.log('----key', key);
      console.log('----key', key);
      console.log('----key', key);
      console.log('----key', key);
      console.log('----key', key);
      mainRegionDB[key](params)
        .catch(err => {
          if (
            err.code === 'ResourceNotFoundException' ||
            err.statusCode === 503
          ) {
            console.log('returning fallback region');
            return fallbackRegionDB[key](params);
          }
          throw err;
        })
        .then(resolve)
        .catch(reject);
    });
};

module.exports.fallbackHandler = fallbackHandler;
