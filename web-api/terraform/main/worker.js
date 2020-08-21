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
      console.log('we have messages ', data.Messages);
      for (let i = 0; i < data.Messages.length; i++) {
        const { Body: body } = data.Messages[i];
        const parsedBody = JSON.parse(body);

        console.log('message body ', parsedBody);

        const documentId = parsedBody.Records[0].s3.object.key;

        // fetch document from s3 quarantine bucket
        let { Body: pdfData } = await s3
          .getObject({
            Bucket: process.env.QUARANTINE_BUCKET,
            Key: documentId,
          })
          .promise();

        console.log('pdf data ', pdfData);

        const inputPdf = tmp.fileSync({
          mode: 0o755,
          tmpdir: process.env.TMP_PATH,
        });
        console.log('got the pdf ');

        fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
        fs.closeSync(inputPdf.fd);

        console.log('done writing the pdf to temp');

        try {
          // run virus scan
          await runVirusScan({ filePath: inputPdf.name });
          // file is clean - move to documents bucket
          console.log('file is clean, moving to doc bucket');

          await s3
            .putObject({
              Body: pdfData,
              Bucket: process.env.CLEAN_DOCUMENTS_BUCKET,
              ContentType: 'application/pdf',
              Key: documentId,
            })
            .promise();

          console.log('about to remove from quarantine bucket');

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
          console.log('about to delete message');

          await sqs.deleteMessage(deleteParams).promise();
        } catch (e) {
          if (e.code === 1) {
            // infected
            console.log('file is not clean ', e);
          } else {
            // error scanning
            console.log('something bad happened ', e);
          }
          console.log(e);
        }
      }

      receiveMessages();
    } else {
      console.log('no messages, will try again soon');
      setTimeout(function () {
        receiveMessages();
      }, 10 * 1000);
    }
  });

receiveMessages();
