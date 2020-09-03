const {
  describeDeployTable,
  describeTable,
} = require('../../../persistence/dynamodbClientService');
const { getCognitoLoginUrl } = require('../../../sharedAppContext');
const { search } = require('../../../persistence/elasticsearch/searchClient');

const getElasticSearchStatus = async ({ applicationContext }) => {
  try {
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: ['docketNumber'],
          query: {
            match_all: {},
          },
          size: 1,
        },
        index: 'efcms-case',
      },
    });
  } catch (e) {
    return false;
  }

  return true;
};

const getDynamoStatus = async ({ applicationContext }) => {
  try {
    const { Table } = await describeTable({ applicationContext });
    return Table.TableStatus === 'ACTIVE';
  } catch (e) {
    return false;
  }
};

const getDeployDynamoStatus = async ({ applicationContext }) => {
  try {
    const { Table } = await describeDeployTable({ applicationContext });
    return Table.TableStatus === 'ACTIVE';
  } catch (e) {
    return false;
  }
};
const handleAxiosTimeout = axios => {
  let source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 1000);
  return source;
};

const getDynamsoftStatus = async ({ applicationContext }) => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    const efcmsDomain = process.env.EFCMS_DOMAIN;
    await Promise.all(
      [
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.initiate.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.config.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.install.js`,
        `https://dynamsoft-lib.${efcmsDomain}/dynamic-web-twain-sdk-14.3.1/dynamsoft.webtwain.css`,
      ].map(url => {
        return axios.get(url, { cancelToken: source.token, timeout: 1000 });
      }),
    );
    return true;
  } catch (e) {
    return false;
  }
};

const checkS3BucketsStatus = async ({ applicationContext, bucketName }) => {
  const bucketNameParams = {
    Bucket: bucketName,
    MaxKeys: 1,
  };

  try {
    await applicationContext
      .getStorageClient()
      .listObjectsV2(bucketNameParams)
      .promise();

    return true;
  } catch (e) {
    return false;
  }
};

const getS3BucketStatus = async ({ applicationContext }) => {
  const efcmsDomain = process.env.EFCMS_DOMAIN;
  const eastS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-us-east-1`;
  const westS3BucketName = `${efcmsDomain}-documents-${applicationContext.environment.stage}-us-west-1`;
  const eastS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-us-east-1`;
  const westS3TempBucketName = `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-us-west-1`;
  const appS3Bucket = `app.${efcmsDomain}`;
  const publicS3Bucket = `${efcmsDomain}`;
  const publicFailoverS3Bucket = `failover.${efcmsDomain}`;
  const appFailoverS3Bucket = `app-failover.${efcmsDomain}`;

  const s3Buckets = [
    eastS3BucketName,
    westS3BucketName,
    eastS3TempBucketName,
    westS3TempBucketName,
    appS3Bucket,
    publicS3Bucket,
    publicFailoverS3Bucket,
    appFailoverS3Bucket,
  ];

  let bucketStatus = {};

  for (const bucket of s3Buckets) {
    bucketStatus[bucket] = await checkS3BucketsStatus({
      applicationContext,
      bucketName: bucket,
    });
  }

  return bucketStatus;
};

const getCognitoStatus = async ({ applicationContext }) => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    axios.get(
      'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login',
      {
        cancelToken: source.token,
        timeout: 20000,
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * getHealthCheckInteractor
 *
 * @param {object} providers.applicationContext the application context
 * @returns {object} contains the status of all our different services
 */
exports.getHealthCheckInteractor = async ({ applicationContext }) => {
  const elasticSearchStatus = await getElasticSearchStatus({
    applicationContext,
  });

  const dynamoStatus = await getDynamoStatus({ applicationContext });
  const deployDynamoStatus = await getDeployDynamoStatus({
    applicationContext,
  });

  const dynamsoftStatus = await getDynamsoftStatus({ applicationContext });

  const s3BucketStatus = await getS3BucketStatus({ applicationContext });

  const cognitoStatus = await getCognitoStatus({ applicationContext });

  return {
    cognito: cognitoStatus,
    dynamo: {
      efcms: dynamoStatus,
      efcmsDeploy: deployDynamoStatus,
    },
    dynamsoft: dynamsoftStatus,
    elasticsearch: elasticSearchStatus,
    s3: s3BucketStatus,
  };
};
