const {
  isAuthorized,
  SERVE_DOCUMENT,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * serveSignedStipDecisionInteractor
 *
 * @param caseId
 * @param documentId
 * @param applicationContext
 * @returns {*}
 */
exports.serveSignedStipDecisionInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const user = applicationContext.getCurrentUser();
  const dateOfService = applicationContext.getUtilities().createISODateString();

  if (!isAuthorized(user, SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }
  const caseEntity = new Case(caseToUpdate);

  const stipulatedDecisionDocument = caseEntity.getDocumentById({
    documentId,
  });

  const aggregateServedParties = parties => {
    const aggregated = [];
    parties.map(party => {
      if (party && party.email) {
        aggregated.push({
          email: party.email,
          name: party.name,
        });
      }
    });
    return aggregated;
  };

  // since this is a stip decision, we will serve all parties
  const servedParties = aggregateServedParties([
    caseEntity.contactPrimary,
    caseEntity.contactSecondary,
    ...caseEntity.practitioners,
    ...caseEntity.respondents,
  ]);

  stipulatedDecisionDocument.setAsServed(servedParties);

  // may need to move the document from a draft state
  // - "signed stipulated decision" becomes "stipulated decision"

  // email parties

  // generate docket record
  caseEntity.addDocketRecord(
    new DocketRecord({
      description: `Stipulated Decision Entered, Judge Foley`,
      documentId,
      filingDate: dateOfService,
    }),
  );

  // close case
  caseEntity.closeCase();

  // update case
  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
