const {
  MAX_FILE_SIZE_BYTES,
} = require('../../business/entities/EntityConstants');

/**
 * getUploadPolicy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the call to the storage client
 */
exports.getUploadPolicy = ({ applicationContext, key }) =>
  new Promise((resolve, reject) => {
    applicationContext.getStorageClient().createPresignedPost(
      {
        Bucket: applicationContext.getQuarantineBucketName(),
        Conditions: [
          ['starts-with', '$key', key],
          ['starts-with', '$Content-Type', ''],
          ['content-length-range', 0, MAX_FILE_SIZE_BYTES],
        ],
      },
      (err, data) => {
        if (err) {
          applicationContext.logger.error(
            'unable to create the upload policy url',
            err,
          );
          return reject(err);
        }
        resolve(data);
      },
    );
  });
