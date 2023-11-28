import { AMENDED_PETITION_FORM_NAME } from '../../entities/EntityConstants';
import { IApplicationContext } from 'types/IApplicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const appendAmendedPetitionFormInteractor = async (
  applicationContext: IApplicationContext,
  { docketEntryId }: { docketEntryId: string },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_ORDER,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  let orderDocument;
  try {
    orderDocument = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: docketEntryId,
        useTempBucket: false,
      });
  } catch (e) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found`);
  }

  const { Body: amendedPetitionFormData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: AMENDED_PETITION_FORM_NAME,
    });

  const combinedPdf = await applicationContext.getUtilities().combineTwoPdfs({
    applicationContext,
    firstPdf: orderDocument,
    secondPdf: amendedPetitionFormData,
  });

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: Buffer.from(combinedPdf),
    pdfName: docketEntryId,
  });
};
