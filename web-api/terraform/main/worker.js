const AWS = require('aws-sdk');
const fs = require('fs');
const tmp = require('tmp');
const util = require('util');
const { exec } = require('child_process');

AWS.config.update({ region: process.env.AWS_REGION });
if (process.env.AWS_ACCESS_KEY_ID) {
  // is local
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
}

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  s3ForcePathStyle: true,
});

//'https://sqs.us-east-1.amazonaws.com/515554424717/s3_clamav_event_exp1'
const queueURL = process.env.sqs_queue_url;
console.log(queueURL, ' *****');
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
    `clamdscan ${
      process.env.CLAMAV_DEF_DIR ? `-d ${process.env.CLAMAV_DEF_DIR}` : ''
    } ${filePath}`,
  );
};

const receiveMessages = () =>
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      for (let i = 0; i < data.Messages.length; i++) {
        const { Body: body } = data.Messages[i];
        const parsedBody = JSON.parse(body);

        console.log(parsedBody.Records[0].s3);

        const documentId = parsedBody.Records[0].s3.object.key;

        // fetch document from s3 quarantine bucket
        let { Body: pdfData } = await s3
          .getObject({
            Bucket: process.env.quarantine_bucket,
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
              Bucket: process.env.clean_documents_bucket,
              ContentType: 'application/pdf',
              Key: documentId,
            })
            .promise();

          // delete from quarantine bucket
          await s3
            .deleteObject({
              Bucket: process.env.quarantine_bucket,
              Key: documentId,
            })
            .promise();

          const deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[i].ReceiptHandle,
          };

          await sqs.deleteMessage(deleteParams).promise();
        } catch (e) {
          if (e.code === 1) {
            // infected
          } else {
            // error scanning
          }
          console.log(e);
        }
      }

      receiveMessages();
    } else {
      setTimeout(function () {
        receiveMessages();
      }, 60 * 1000);
    }
  });

receiveMessages();
