const AWS = require('aws-sdk');
const fs = require('fs');
const tmp = require('tmp');
const util = require('util');
const { exec } = require('child_process');

AWS.config.update({ region: 'us-east-1' });
if (process.env.AWS_ACCESS_KEY_ID) {
  // is local
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  console.log(
    'id ',
    process.env.AWS_ACCESS_KEY_ID,
    ' key ',
    process.env.AWS_SECRET_ACCESS_KEY,
  );
}

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const s3 = new AWS.S3({
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

const execPromise = util.promisify(exec);
const runVirusScan = async ({ filePath }) => {
  return execPromise(
    `clamscan ${
      process.env.CLAMAV_DEF_DIR ? `-d ${process.env.CLAMAV_DEF_DIR}` : ''
    } ${filePath}`,
  );
};

sqs.receiveMessage(params, async (err, data) => {
  if (err) {
    console.log('Receive Error', err);
  } else if (data.Messages) {
    const { Body: body } = data.Messages[0];
    const parsedBody = JSON.parse(body);

    const documentId = parsedBody.Records[0].s3.object.key;

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
          Bucket: 'exp1.ustc-case-mgmt.flexion.us-documents-exp1-us-east-1',
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
