const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const {
  migrateItems: migration0028,
} = require('./migrations/0028-contact-primary-email');
const {
  migrateItems: migration0029,
} = require('./migrations/0029-fix-duplicate-contact-id');
const {
  migrateItems: migration0030,
} = require('./migrations/0030-docket-entry-docket-number-required');
const {
  migrateItems: validationMigration,
} = require('./migrations/0000-validate-all-items');
const { chunk, isEmpty } = require('lodash');

const MAX_DYNAMO_WRITE_SIZE = 25;

const applicationContext = createApplicationContext({});
const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  region: 'us-east-1',
  retryDelayOptions: { base: 300 },
});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const sqs = new AWS.SQS({ region: 'us-east-1' });

// eslint-disable-next-line no-unused-vars
const migrateRecords = async ({ documentClient, items }) => {
  applicationContext.logger.debug('about to run migration 0028');
  items = await migration0028(items, documentClient);
  applicationContext.logger.debug('about to run migration 0029');
  items = await migration0029(items, documentClient);
  applicationContext.logger.debug('about to run migration 0030');
  items = await migration0030(items, documentClient);

  applicationContext.logger.debug('about to run validation migration');
  items = await validationMigration(items, documentClient);

  return items;
};

const reprocessItems = async ({ documentClient, items }) => {
  // items already been migrated. they simply could not be processed in the batchWrite. Try again recursively
  const results = await documentClient
    .batchWrite({
      RequestItems: items,
    })
    .promise();
  if (!isEmpty(results.UnprocessedItems)) {
    await reprocessItems({
      documentClient,
      items: results.UnprocessedItems,
    });
  }
};

const processItems = async ({ documentClient, items }) => {
  try {
    items = await migrateRecords({ documentClient, items });
  } catch (err) {
    applicationContext.logger.error('Error migrating records', err);
    throw err;
  }

  // your migration code goes here
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let c of chunks) {
    const results = await documentClient
      .batchWrite({
        RequestItems: {
          [process.env.DESTINATION_TABLE]: c.map(item => ({
            PutRequest: {
              Item: {
                ...item,
              },
            },
          })),
        },
      })
      .promise();

    if (!isEmpty(results.UnprocessedItems)) {
      await reprocessItems({
        documentClient,
        items: results.UnprocessedItems,
      });
    }
  }
};

exports.processItems = processItems;

const scanTableSegment = async (segment, totalSegments) => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await dynamoDbDocumentClient
      .scan({
        ExclusiveStartKey: lastKey,
        Segment: segment,
        TableName: process.env.SOURCE_TABLE,
        TotalSegments: totalSegments,
      })
      .promise()
      .then(async results => {
        applicationContext.logger.info(
          `${segment}/${totalSegments} got ${results.Items.length} results`,
        );
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        await processItems({
          documentClient: dynamoDbDocumentClient,
          items: results.Items,
        });
      });
  }
};

exports.handler = async event => {
  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  applicationContext.logger.info(
    `about to process ${segment} of ${totalSegments}`,
  );

  await scanTableSegment(segment, totalSegments);
  applicationContext.logger.info(`finishing ${segment} of ${totalSegments}`);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
