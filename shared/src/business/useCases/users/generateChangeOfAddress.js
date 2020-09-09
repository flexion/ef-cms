const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
} = require('../../entities/EntityConstants');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { clone } = require('lodash');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
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
    .getDocketNumbersByUser({
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

  for (let docketNumber of docketNumbers) {
    try {
      let oldData;
      const newData = contactInfo;

      const name = updatedName ? updatedName : user.name;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

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

        const newDocumentId = applicationContext.getUniqueId();

        const documentData = {
          addToCoversheet: true,
          additionalInfo: `for ${name}`,
          description: documentType.title,
          docketNumber: caseEntity.docketNumber,
          documentId: newDocumentId,
          documentTitle: documentType.title,
          documentType: documentType.title,
          eventCode: documentType.eventCode,
          isAutoGenerated: true,
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

        const servedParties = aggregatePartiesForService(caseEntity);

        changeOfAddressDocketEntry.setAsServed(servedParties.all);

        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          docketEntryEntity: changeOfAddressDocketEntry,
          servedParties,
        });

        const workItem = new WorkItem(
          {
            assigneeId: null,
            assigneeName: null,
            associatedJudge: caseEntity.associatedJudge,
            caseIsInProgress: caseEntity.inProgress,
            caseStatus: caseEntity.status,
            caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
            docketNumber: caseEntity.docketNumber,
            docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
            document: {
              ...changeOfAddressDocketEntry.toRawObject(),
              createdAt: changeOfAddressDocketEntry.createdAt,
            },
            section: DOCKET_SECTION,
            sentBy: user.name,
            sentByUserId: user.userId,
          },
          { applicationContext },
        );

        changeOfAddressDocketEntry.setWorkItem(workItem);

        caseEntity.addDocketEntry(changeOfAddressDocketEntry);

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
            documentId: newDocumentId,
          });

        await applicationContext
          .getPersistenceGateway()
          .saveWorkItemForNonPaper({
            applicationContext,
            workItem: workItem.validate().toRawObject(),
          });
      }

      if (shouldUpdateCase) {
        const updatedCase = await applicationContext
          .getPersistenceGateway()
          .updateCase({
            applicationContext,
            caseToUpdate: caseEntity.validate().toRawObject(),
          });

        const updatedCaseRaw = new Case(updatedCase, { applicationContext })
          .validate()
          .toRawObject();
        updatedCases.push(updatedCaseRaw);
      }
    } catch (error) {
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
