import { state } from 'cerebral';

export default async ({ store, applicationContext, props }) => {
  const url = await applicationContext.getUseCases().getDownloadDocumentUrl({
    documentId: props.documentId,
    applicationContext,
  });
  store.set(state.documentDownloadUrl, url);
};
