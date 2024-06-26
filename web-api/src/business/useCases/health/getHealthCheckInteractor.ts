import { S3 } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';

const regionEast = 'us-east-1';
const regionWest = 'us-west-1';

const handleAxiosTimeout = axios => {
  let source = axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 1000);
  return source;
};

type S3BucketsStatus = {
  app: boolean;
  appFailover: boolean;
  eastDocuments: boolean;
  eastTempDocuments: boolean;
  public: boolean;
  publicFailover: boolean;
  westDocuments: boolean;
  westTempDocuments: boolean;
};

type DynamoTablesStatus = {
  efcms: boolean;
  efcmsDeploy: boolean;
};

export type ApplicationHealth = {
  cognito: boolean;
  dynamo: DynamoTablesStatus;
  dynamsoft: boolean;
  elasticsearch: boolean;
  emailService: boolean;
  s3: S3BucketsStatus;
};

const getElasticSearchStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  try {
    await applicationContext.getPersistenceGateway().getFirstSingleCaseRecord({
      applicationContext,
    });
  } catch (e) {
    applicationContext.logger.error('Elasticsearch health check failed. ', e);
    return false;
  }

  return true;
};

const getDynamoStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  try {
    const dynamoStatus = await applicationContext
      .getPersistenceGateway()
      .getTableStatus({ applicationContext });
    return dynamoStatus === 'ACTIVE';
  } catch (e) {
    applicationContext.logger.error('Dynamo health check failed. ', e);
    return false;
  }
};

const getDeployDynamoStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  try {
    const deployDynamoStatus = await applicationContext
      .getPersistenceGateway()
      .getDeployTableStatus({ applicationContext });
    return deployDynamoStatus === 'ACTIVE';
  } catch (e) {
    applicationContext.logger.error('Dynamo deploy health check failed. ', e);
    return false;
  }
};

const getDynamsoftStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  const axios = applicationContext.getHttpClient();

  const source = handleAxiosTimeout(axios);

  try {
    const scannerResourceUri = applicationContext.getScannerResourceUri();
    await Promise.all(
      [
        `${scannerResourceUri}/dynamsoft.webtwain.initiate.js`,
        `${scannerResourceUri}/dynamsoft.webtwain.config.js`,
        `${scannerResourceUri}/dynamsoft.webtwain.install.js`,
        `${scannerResourceUri}/src/dynamsoft.webtwain.css`,
      ].map(url => {
        return axios.get(url, { cancelToken: source.token, timeout: 1000 });
      }),
    );
    return true;
  } catch (e) {
    applicationContext.logger.error('Dynamsoft health check failed. ', e);
    return false;
  }
};

const checkS3BucketsStatus = async ({
  applicationContext,
  bucketInfo,
}: {
  applicationContext: ServerApplicationContext;
  bucketInfo: { bucketName: string; region: string };
}): Promise<boolean> => {
  try {
    const client = new S3({
      maxAttempts: 3,
      region: bucketInfo.region,
    });

    await client.listObjectsV2({
      Bucket: bucketInfo.bucketName,
      MaxKeys: 1,
    });

    return true;
  } catch (e) {
    applicationContext.logger.error('S3 health check failed. ', e);
    return false;
  }
};

const getS3BucketStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<S3BucketsStatus> => {
  const efcmsDomain = process.env.EFCMS_DOMAIN;
  const currentColor = process.env.CURRENT_COLOR;
  const eastS3BucketName = {
    bucketName: `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionEast}`,
    region: regionEast,
  };
  const westS3BucketName = {
    bucketName: `${efcmsDomain}-documents-${applicationContext.environment.stage}-${regionWest}`,
    region: regionWest,
  };
  const eastS3TempBucketName = {
    bucketName: `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionEast}`,
    region: regionEast,
  };
  const westS3TempBucketName = {
    bucketName: `${efcmsDomain}-temp-documents-${applicationContext.environment.stage}-${regionWest}`,
    region: regionWest,
  };
  const appS3Bucket = {
    bucketName: `app-${currentColor}.${efcmsDomain}`,
    region: regionEast,
  };
  const publicS3Bucket = {
    bucketName: `${currentColor}.${efcmsDomain}`,
    region: regionEast,
  };
  const publicFailoverS3Bucket = {
    bucketName: `failover-${currentColor}.${efcmsDomain}`,
    region: regionWest,
  };
  const appFailoverS3Bucket = {
    bucketName: `app-failover-${currentColor}.${efcmsDomain}`,
    region: regionWest,
  };

  const s3Buckets = {
    app: appS3Bucket,
    appFailover: appFailoverS3Bucket,
    eastDocuments: eastS3BucketName,
    eastTempDocuments: eastS3TempBucketName,
    public: publicS3Bucket,
    publicFailover: publicFailoverS3Bucket,
    westDocuments: westS3BucketName,
    westTempDocuments: westS3TempBucketName,
  };

  let bucketStatus: S3BucketsStatus = {
    app: false,
    appFailover: false,
    eastDocuments: false,
    eastTempDocuments: false,
    public: false,
    publicFailover: false,
    westDocuments: false,
    westTempDocuments: false,
  };

  for (const [key, value] of Object.entries(s3Buckets)) {
    bucketStatus[key] = await checkS3BucketsStatus({
      applicationContext,
      bucketInfo: value,
    });
  }

  return bucketStatus;
};

const getCognitoStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  try {
    await applicationContext.getCognito().describeUserPool({
      UserPoolId: applicationContext.environment.userPoolId,
    });
    return true;
  } catch (e) {
    applicationContext.logger.error('Cognito health check failed. ', e);
    return false;
  }
};

const getEmailServiceStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<boolean> => {
  // at risk of being throttled if used with a non-cached health check
  try {
    return await applicationContext
      .getPersistenceGateway()
      .getSesStatus({ applicationContext });
  } catch (e) {
    applicationContext.logger.error('Email service health check failed. ', e);
    return false;
  }
};

export const getHealthCheckInteractor = async (
  applicationContext: ServerApplicationContext,
): Promise<ApplicationHealth> => {
  const [
    elasticSearchStatus,
    dynamoStatus,
    deployDynamoStatus,
    dynamsoftStatus,
    s3BucketStatus,
    cognitoStatus,
    emailServiceStatus,
  ] = await Promise.all([
    getElasticSearchStatus({
      applicationContext,
    }),
    getDynamoStatus({ applicationContext }),
    getDeployDynamoStatus({
      applicationContext,
    }),
    getDynamsoftStatus({ applicationContext }),
    getS3BucketStatus({ applicationContext }),
    getCognitoStatus({ applicationContext }),
    getEmailServiceStatus({
      applicationContext,
    }),
  ]);
  return {
    cognito: cognitoStatus,
    dynamo: {
      efcms: dynamoStatus,
      efcmsDeploy: deployDynamoStatus,
    },
    dynamsoft: dynamsoftStatus,
    elasticsearch: elasticSearchStatus,
    emailService: emailServiceStatus,
    s3: s3BucketStatus,
  };
};
