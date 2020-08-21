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

const queueURL = process.env.SQS_QUEUE_URL;
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
  return execPromise(`clamdscan ${filePath}`);
};

const receiveMessages = () =>
  sqs.receiveMessage(params, async (err, data) => {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      for (let i = 0; i < data.Messages.length; i++) {
        const { Body: body } = data.Messages[i];
        const parsedBody = JSON.parse(body);

        const documentId = parsedBody.Records[0].s3.object.key;

        // fetch document from s3 quarantine bucket
        let { Body: pdfData } = await s3
          .getObject({
            Bucket: process.env.QUARANTINE_BUCKET,
            Key: documentId,
          })
          .promise();

        const inputPdf = tmp.fileSync({
          mode: 0o755,
          tmpdir: process.env.TMP_PATH,
        });
        fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
        fs.closeSync(inputPdf.fd);

        try {
          // run virus scan
          await runVirusScan({ filePath: inputPdf.name });
          // file is clean - move to documents bucket
          await s3
            .putObject({
              Body: pdfData,
              Bucket: process.env.CLEAN_DOCUMENTS_BUCKET,
              ContentType: 'application/pdf',
              Key: documentId,
            })
            .promise();

          // delete from quarantine bucket
          await s3
            .deleteObject({
              Bucket: process.env.QUARANTINE_BUCKET,
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
      }, 10 * 1000);
    }
  });

receiveMessages();
