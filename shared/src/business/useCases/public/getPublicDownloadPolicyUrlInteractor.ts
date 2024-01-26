import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';
import { Case, isSealedCase } from '../../entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';

export const getPublicDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    isTerminalUser,
    key,
  }: { docketNumber: string; isTerminalUser: boolean; key: string },
): Promise<{ url: string }> => {
  const caseToCheck: any = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToCheck.docketNumber && !caseToCheck.entityName) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToCheck, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(`Docket entry ${key} was not found.`);
  }

  if (!docketEntryEntity.isFileAttached) {
    throw new NotFoundError(
      `Docket entry ${key} does not have an attached file.`,
    );
  }

  if (docketEntryEntity.isSealed) {
    throw new UnauthorizedError('Docket entry has been sealed.');
  }

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const documentVisibilityChangeDate =
    featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ];

  const isPublic = DocketEntry.isPublic(docketEntryEntity, {
    caseIsSealed: isSealedCase(caseEntity),
    rootDocument: DocketEntry.fetchRootDocument(
      docketEntryEntity,
      caseEntity.docketEntries,
    ),
    visibilityChangeDate: documentVisibilityChangeDate,
  });

  if (
    !DocketEntry.isDownloadable(docketEntryEntity, {
      isCourtUser: false,
      isPublic,
      userHasAccessToCase: isTerminalUser,
    })
  ) {
    throw new UnauthorizedError('Unauthorized to access private document');
  }

  return await applicationContext
    .getPersistenceGateway()
    .getPublicDownloadPolicyUrl({
      applicationContext,
      key,
    });
};
