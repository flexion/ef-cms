import { S3 } from '@aws-sdk/client-s3';

interface IApplicationContext {
  [key: string]: any;
  getUniqueId: () => string;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers: IGetUseCaseHelpers;
  getUseCases: IGetUseCases;
  getUtilities: IGetUtilities;
  getDocumentGenerators: IGetDocumentGenerators;
  getStorageClient: () => S3;
}
