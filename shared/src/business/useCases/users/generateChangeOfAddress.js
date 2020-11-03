const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
} = require('../../entities/EntityConstants');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { clone } = require('lodash');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { WorkItem } = require('../../entities/WorkItem');

exports.generateChangeOfAddress = async ({
  applicationContext,
  contactInfo,
  updatedName,
  user,
}) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getCasesByUserId({
      applicationContext,
      userId: user.userId,
    });

  let completedCases = 0;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_update_progress',
      completedCases,
      totalCases: docketNumbers.length,
    },
    userId: user.userId,
  });

  const updatedCases = [];

  for (let { docketNumber } of docketNumbers) {
    try {
      let oldData;
      const newData = contactInfo;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      const name = updatedName ? updatedName : user.name;

      let caseEntity = new Case(userCase, { applicationContext });
      const privatePractitioner = caseEntity.privatePractitioners.find(
        practitioner => practitioner.userId === user.userId,
      );
      if (privatePractitioner) {
        oldData = clone(privatePractitioner.contact);
        privatePractitioner.contact = contactInfo;
        privatePractitioner.name = name;
      }
      const irsPractitioner = caseEntity.irsPractitioners.find(
        practitioner => practitioner.userId === user.userId,
      );
      if (irsPractitioner) {
        oldData = clone(irsPractitioner.contact);
        irsPractitioner.contact = contactInfo;
        irsPractitioner.name = name;
      }

      // we do this again so that it will convert '' to null
      caseEntity = new Case(caseEntity, { applicationContext });
      const rawCase = caseEntity.validate().toRawObject();

      const caseDetail = {
        ...rawCase,
      };

      let closedMoreThan6Months;
      if (caseEntity.status === CASE_STATUS_TYPES.closed) {
        const maxClosedDate = calculateISODate({
          dateString: caseEntity.closedDate,
          howMuch: 6,
          units: 'months',
        });
        const rightNow = createISODateString();
        closedMoreThan6Months = maxClosedDate <= rightNow;
      }

      const shouldGenerateNotice =
        caseEntity.status !== CASE_STATUS_TYPES.closed;
      const shouldUpdateCase =
        !closedMoreThan6Months ||
        caseEntity.status !== CASE_STATUS_TYPES.closed;
      let docketEntryAdded = false;

      if (shouldGenerateNotice) {
        const documentType = applicationContext
          .getUtilities()
          .getDocumentTypeForAddressChange({
            newData,
            oldData,
          });

        if (!documentType) return;

        const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(
          caseDetail,
        );

        const changeOfAddressPdf = await applicationContext
          .getDocumentGenerators()
          .changeOfAddress({
            applicationContext,
            content: {
              caseCaptionExtension,
              caseTitle,
              docketNumber: caseDetail.docketNumber,
              docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
              documentTitle: documentType.title,
              name: `${name} (${user.barNumber})`,
              newData,
              oldData,
            },
          });

        const newDocketEntryId = applicationContext.getUniqueId();

        const documentData = {
          addToCoversheet: true,
          additionalInfo: `for ${name}`,
          docketEntryId: newDocketEntryId,
          docketNumber: caseEntity.docketNumber,
          documentTitle: documentType.title,
          documentType: documentType.title,
          eventCode: documentType.eventCode,
          isAutoGenerated: true,
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          userId: user.userId,
        };

        if (user.role === ROLES.privatePractitioner) {
          documentData.privatePractitioners = [
            {
              name,
              partyPrivatePractitioner: true,
            },
          ];
        } else if (user.role === ROLES.irsPractitioner) {
          documentData.partyIrsPractitioner = true;
        }

        const changeOfAddressDocketEntry = new DocketEntry(documentData, {
          applicationContext,
        });

        changeOfAddressDocketEntry.filedBy = undefined;

        const servedParties = aggregatePartiesForService(caseEntity);
        changeOfAddressDocketEntry.setAsServed(servedParties.all);

        caseEntity.addDocketEntry(changeOfAddressDocketEntry);

        applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          docketEntryId: changeOfAddressDocketEntry.docketEntryId,
          servedParties,
        });

        const paperServiceRequested =
          userCase.contactPrimary.serviceIndicator ===
            SERVICE_INDICATOR_TYPES.SI_PAPER ||
          (userCase.contactSecondary &&
            userCase.contactSecondary.serviceIndicator ===
              SERVICE_INDICATOR_TYPES.SI_PAPER) ||
          user.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;

        let workItem = null;

        if (paperServiceRequested) {
          workItem = new WorkItem(
            {
              assigneeId: null,
              assigneeName: null,
              associatedJudge: caseEntity.associatedJudge,
              caseIsInProgress: caseEntity.inProgress,
              caseStatus: caseEntity.status,
              caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
              docketEntry: {
                ...changeOfAddressDocketEntry.toRawObject(),
                createdAt: changeOfAddressDocketEntry.createdAt,
              },
              docketNumber: caseEntity.docketNumber,
              docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
              section: DOCKET_SECTION,
              sentBy: user.name,
              sentByUserId: user.userId,
            },
            { applicationContext },
          );

          changeOfAddressDocketEntry.setWorkItem(workItem);
        }

        const { pdfData: changeOfAddressPdfWithCover } = await addCoverToPdf({
          applicationContext,
          caseEntity,
          docketEntryEntity: changeOfAddressDocketEntry,
          pdfData: changeOfAddressPdf,
        });

        await applicationContext
          .getPersistenceGateway()
          .saveDocumentFromLambda({
            applicationContext,
            document: changeOfAddressPdfWithCover,
            key: newDocketEntryId,
          });

        changeOfAddressDocketEntry.numberOfPages = await applicationContext
          .getUseCaseHelpers()
          .countPagesInDocument({
            applicationContext,
            docketEntryId: changeOfAddressDocketEntry.docketEntryId,
          });

        if (workItem) {
          applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
            applicationContext,
            workItem: workItem.validate().toRawObject(),
          });
        }

        caseEntity.updateDocketEntry(changeOfAddressDocketEntry);
        docketEntryAdded = true;
      }

      if (shouldUpdateCase || docketEntryAdded) {
        const validatedRawCase = caseEntity.validate().toRawObject();

        const updatedCase = await applicationContext
          .getPersistenceGateway()
          .updateCase({
            applicationContext,
            caseToUpdate: validatedRawCase,
          });

        updatedCases.push(updatedCase);
      }
    } catch (error) {
      applicationContext.logger.error(error);
      applicationContext.notifyHoneybadger(error);
    }

    completedCases++;
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_progress',
        completedCases,
        totalCases: docketNumbers.length,
      },
      userId: user.userId,
    });
  }

  return updatedCases;
};
