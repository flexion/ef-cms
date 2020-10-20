const AWS = require('aws-sdk');
const { flattenDeep, get, partition } = require('lodash');

const partitionRecords = records => {
  const [removeRecords, insertModifyRecords] = partition(
    records,
    record => record.eventName === 'REMOVE',
  );

  const [docketEntryRecords, nonDocketEntryRecords] = partition(
    insertModifyRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'DocketEntry',
  );

  const [caseEntityRecords, otherRecords] = partition(
    nonDocketEntryRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'Case',
  );

  return {
    caseEntityRecords,
    docketEntryRecords,
    otherRecords,
    removeRecords,
  };
};

/**
 * fetches the latest version of the case from dynamodb and re-indexes all of the docket-entries associated with the case.
 *
 * @param {array} caseEntityRecords all of the event stream records associated with case entities
 */
const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
}) => {
  if (!caseEntityRecords.length) return;

  applicationContext.logger.info(
    `going to index ${caseEntityRecords.length} caseEntityRecords`,
  );

  const indexCaseEntry = async caseRecord => {
    const caseNewImage = caseRecord.dynamodb.NewImage;
    const caseRecords = [];

    // we don't need to store the docket entry list onto the case
    delete caseNewImage.docketEntries;

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: caseNewImage.pk.S,
          },
          sk: {
            S: `${caseNewImage.sk.S}`,
          },
        },
        NewImage: {
          ...caseNewImage, // TODO: We don't need docketEntries array - remove for better perf (consider for actual case index as well)
          case_relations: { name: 'case' },
          entityName: { S: 'CaseDocketEntryMapping' },
        }, // Create a mapping record on the docket-entry index for parent-child relationships
      },
      eventName: 'MODIFY',
    });

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: caseNewImage.pk.S,
          },
          sk: {
            S: caseNewImage.sk.S,
          },
        },
        NewImage: caseNewImage,
      },
      eventName: 'MODIFY',
    });

    return caseRecords;
  };

  const indexRecords = await Promise.all(caseEntityRecords.map(indexCaseEntry));

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: flattenDeep(indexRecords),
  });

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the case or docket entry records that failed to index',
      failedRecords,
    );
    applicationContext.notifyHoneybadger(
      'the case or docket entry records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index case entry or docket entry records');
  }
};

/**
 * fetches the latest version of the case from dynamodb and re-indexes this docket-entries combined with the latest case info.
 *
 * @param {array} docketEntryRecords all of the event stream records associated with docket entries
 */
const processDocketEntries = async ({
  applicationContext,
  docketEntryRecords,
  utils,
}) => {
  if (!docketEntryRecords.length) return;

  applicationContext.logger.info(
    `going to index ${docketEntryRecords.length} docketEntryRecords`,
  );

  const newDocketEntryRecords = await Promise.all(
    docketEntryRecords.map(async record => {
      // TODO: May need to remove the `case_relations` object and re-add later
      const fullDocketEntry = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage,
      );

      if (fullDocketEntry.documentContentsId) {
        // TODO: for performance, we should not re-index doc contents if we do not have to (use a contents hash?)
        try {
          const buffer = await utils.getDocument({
            applicationContext,
            documentContentsId: fullDocketEntry.documentContentsId,
          });
          const { documentContents } = JSON.parse(buffer.toString());
          fullDocketEntry.documentContents = documentContents;
        } catch (err) {
          applicationContext.logger.error(err);
          applicationContext.logger.error(
            `the s3 document of ${fullDocketEntry.documentContentsId} was not found in s3`,
          );
        }
      }

      const caseDocketEntryMappingRecordId = `${fullDocketEntry.pk}_${fullDocketEntry.pk}|mapping`;

      return {
        dynamodb: {
          Keys: {
            pk: {
              S: fullDocketEntry.pk,
            },
            sk: {
              S: fullDocketEntry.sk,
            },
          },
          NewImage: {
            ...AWS.DynamoDB.Converter.marshall(fullDocketEntry),
            case_relations: {
              name: 'document',
              parent: caseDocketEntryMappingRecordId,
            },
          },
        },
        eventName: 'MODIFY',
      };
    }),
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: newDocketEntryRecords,
  });

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the docket entry records that failed to index',
      failedRecords,
    );
    applicationContext.notifyHoneybadger(
      'the docket entry records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index docket entry records');
  }
};

const processOtherEntries = async ({ applicationContext, otherRecords }) => {
  if (!otherRecords.length) return;

  applicationContext.logger.info(
    `going to index ${otherRecords.length} otherRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: otherRecords,
  });

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the records that failed to index',
      failedRecords,
    );
    applicationContext.notifyHoneybadger(
      'the records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index records');
  }
};

const processRemoveEntries = async ({ applicationContext, removeRecords }) => {
  if (!removeRecords.length) return;

  applicationContext.logger.info(
    `going to index ${removeRecords.length} removeRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkDeleteRecords({
    applicationContext,
    records: removeRecords,
  });

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the records that failed to delete',
      failedRecords,
    );
    applicationContext.notifyHoneybadger(
      'failed to delete these records from elasticsearch',
      failedRecords,
    );
    throw new Error('failed to delete records');
  }
};

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<object>} providers.recordsToProcess the records to process
 * @returns {object} the results of all the index calls for logging
 */
exports.processStreamRecordsInteractor = async ({
  applicationContext,
  recordsToProcess,
}) => {
  const getCase = ({ applicationContext: appContext, docketNumber }) =>
    appContext.getPersistenceGateway().getFullCaseByDocketNumber({
      applicationContext: appContext,
      docketNumber,
    });

  const getDocument = ({
    applicationContext: appContext,
    documentContentsId,
  }) =>
    appContext.getPersistenceGateway().getDocument({
      applicationContext: appContext,
      key: documentContentsId,
      protocol: 'S3',
      useTempBucket: false,
    });

  recordsToProcess = recordsToProcess.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(record, NEW_TIME_KEY);
    const oldTime = get(record, OLD_TIME_KEY);
    return (
      process.env.NODE_ENV !== 'production' || (newTime && newTime !== oldTime)
    );
  });

  const {
    caseEntityRecords,
    docketEntryRecords,
    otherRecords,
    removeRecords,
  } = partitionRecords(recordsToProcess);

  const utils = {
    getCase,
    getDocument,
  };

  try {
    await processRemoveEntries({
      applicationContext,
      removeRecords,
    }).catch(err => {
      applicationContext.logger.error(err);
      applicationContext.logger.info("failed to processRemoveEntries',");
      applicationContext.notifyHoneybadger(err, {
        message: 'failed to processRemoveEntries',
      });
      throw err;
    });

    await Promise.all([
      processCaseEntries({
        applicationContext,
        caseEntityRecords,
        utils,
      }).catch(err => {
        applicationContext.logger.error(err);
        applicationContext.logger.info("failed to processCaseEntries',");
        applicationContext.notifyHoneybadger(err, {
          message: 'failed to processCaseEntries',
        });
        throw err;
      }),
      processDocketEntries({
        applicationContext,
        docketEntryRecords,
        utils,
      }).catch(err => {
        applicationContext.logger.error(err);
        applicationContext.logger.info("failed to processDocketEntries',");
        applicationContext.notifyHoneybadger(err, {
          message: 'failed to processDocketEntries',
        });
        throw err;
      }),
      processOtherEntries({ applicationContext, otherRecords }).catch(err => {
        applicationContext.logger.error(err);
        applicationContext.logger.info("failed to processOtherEntries',");
        applicationContext.notifyHoneybadger(err, {
          message: 'failed to processOtherEntries',
        });
        throw err;
      }),
    ]);
  } catch (err) {
    applicationContext.logger.info(
      'processStreamRecordsInteractor failed to process the records',
      err,
    );
    applicationContext.notifyHoneybadger(err);
    throw err;
  }
};

exports.partitionRecords = partitionRecords;
exports.processCaseEntries = processCaseEntries;
exports.processDocketEntries = processDocketEntries;
exports.processOtherEntries = processOtherEntries;
exports.processRemoveEntries = processRemoveEntries;
