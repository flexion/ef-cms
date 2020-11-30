const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} = require('../../utilities/caseFilter');
const { Case, isSealedCase } = require('../../entities/cases/Case');
const { NotFoundError } = require('../../../errors/errors');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * getPublicCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getPublicCaseInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  let rawCaseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.stripLeadingZeros(docketNumber),
    });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  if (isSealedCase(rawCaseRecord)) {
    rawCaseRecord = caseSealedFormatter(rawCaseRecord);
  }
  rawCaseRecord = caseContactAddressSealedFormatter(rawCaseRecord, {});

  const publicCaseDetail = new PublicCase(rawCaseRecord, {
    applicationContext,
  });

  return publicCaseDetail.validate().toRawObject();
};
