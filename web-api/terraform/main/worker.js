const AWS = require('aws-sdk');
const fs = require('fs');
const tmp = require('tmp');
const util = require('util');

AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const s3 = new AWS.S3({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  s3ForcePathStyle: true,
});

const queueURL =
  'https://sqs.us-east-1.amazonaws.com/515554424717/s3_clamav_event_exp1';

const params = {
  AttributeNames: ['SentTimestamp'],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

const runVirusScan = async ({ filePath }) => {
  return util.promisify(
    `clamscan ${
      process.env.CLAMAV_DEF_DIR ? `-d ${process.env.CLAMAV_DEF_DIR}` : ''
    } ${filePath}`,
  );
};

sqs.receiveMessage(params, async (err, data) => {
  if (err) {
    console.log('Receive Error', err);
  } else if (data.Messages) {
    const { body } = data.Messages[0];
    const documentId = body.Records.s3.key;

    // fetch document from s3 quarantine bucket
    let { Body: pdfData } = await s3
      .getObject({
        Bucket: 'exp1.ustc-case-mgmt.flexion.us-quarantine',
        Key: documentId,
      })
      .promise();

    const inputPdf = tmp.fileSync();
    fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
    fs.closeSync(inputPdf.fd);

    try {
      // run virus scan
      await runVirusScan({ filePath: inputPdf.name });
      // file is clean - move to documents bucket
      await s3
        .putObject({
          Body: pdfData,
          Bucket: 'noop-documents-local-us-east-1',
          ContentType: 'application/pdf',
          Key: documentId,
        })
        .promise();

      // delete from quarantine bucket
      await s3
        .deleteObject({
          Bucket: 'exp1.ustc-case-mgmt.flexion.us-quarantine',
          Key: documentId,
        })
        .promise();
    } catch (e) {
      if (e.code === 1) {
        // infected
      } else {
        // error scanning
      }
      console.log(e);
    }

    const deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle,
    };
    sqs.deleteMessage(deleteParams, function (err, data) {
      if (err) {
        console.log('Delete Error', err);
      } else {
        console.log('Message Deleted', data);
      }
    });
  }
});
