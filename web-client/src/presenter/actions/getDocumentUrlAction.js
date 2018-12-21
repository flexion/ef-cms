import { state } from 'cerebral';

export default async ({ store, applicationContext, props }) => {
  console.log('props', props);
  const url = await applicationContext.getUseCases().getDownloadDocumentUrl({
    documentId: props.documentId,
    applicationContext,
  });
  console.log('url', url);
  store.set(state.documentUrl, url);
};
