import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTIES_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  DocketEntry,
  getServedPartiesCode,
} from '../../../../../shared/src/business/entities/DocketEntry';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';

export const createAndServeNoticeDocketEntry = async (
  applicationContext: ServerApplicationContext,
  {
    additionalDocketEntryInfo = {},
    caseEntity,
    documentInfo,
    newPdfDoc,
    noticePdf,
    onlyProSePetitioners,
  }: {
    additionalDocketEntryInfo?: any;
    caseEntity: Case;
    documentInfo: {
      documentType: string;
      documentTitle: string;
      eventCode: string;
    };
    newPdfDoc: any;
    noticePdf: Buffer;
    onlyProSePetitioners?: boolean;
  },
  authorizedUser: AuthUser,
) => {
  const docketEntryId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: noticePdf,
    key: docketEntryId,
  });

  const servedParties = aggregatePartiesForService(caseEntity, {
    onlyProSePetitioners,
  });

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
    });

  const noticeDocketEntry = new DocketEntry(
    {
      docketEntryId,
      documentTitle: documentInfo.documentTitle,
      documentType: documentInfo.documentType,
      eventCode: documentInfo.eventCode,
      isAutoGenerated: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      numberOfPages,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      servedAt: createISODateString(),
      servedParties: servedParties.all,
      servedPartiesCode: onlyProSePetitioners
        ? PARTIES_CODES.PETITIONER
        : getServedPartiesCode(servedParties.all),
      ...additionalDocketEntryInfo,
    },
    { authorizedUser },
  );

  noticeDocketEntry.setFiledBy(authorizedUser);

  caseEntity.addDocketEntry(noticeDocketEntry);

  await applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase({
    applicationContext,
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity: noticeDocketEntry,
    noticeDocumentPdfData: noticePdf,
    servedParties,
    skipEmailToIrs: onlyProSePetitioners,
  });
};
