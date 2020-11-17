const AWS = require('aws-sdk');
const createApplicationContext = require('../../../src/applicationContext');
const {
  migrateItems: migration0001,
} = require('./migrations/0001-user-case-add-closed-date');
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

const migrateRecords = async ({ documentClient, items }) => {
  items = await migration0001(items, documentClient, applicationContext);
  return items;
};

const reprocessItems = async ({ documentClient, items }) => {
  // items  already been migrated. they simply could not be processed in the batchWrite. Try again recursively
  const numUnprocessed = items[process.env.DESTINATION_TABLE].length;
  applicationContext.logger.info(`reprocessing ${numUnprocessed} items`);
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
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let c of chunks) {
    c = await migrateRecords({ documentClient, items: c });

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
        console.log('got some results', results.Items.length);
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

  console.log(`about to process ${segment} of ${totalSegments}`);

  await scanTableSegment(segment, totalSegments);
  await sqs
    .deleteMessage({
      QueueUrl: process.env.SEGMENTS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
