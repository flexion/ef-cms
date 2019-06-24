import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitleAction = ({ applicationContext, get, store }) => {
  const documentMetadata = get(state.form);

  let documentTitle = applicationContext.getUseCases().generateDocumentTitle({
    applicationContext,
    documentMetadata,
  });
  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(documentMetadata.secondaryDocument)) {
    documentTitle = applicationContext.getUseCases().generateDocumentTitle({
      applicationContext,
      documentMetadata: documentMetadata.secondaryDocument,
    });
    store.set(state.form.secondaryDocument.documentTitle, documentTitle);
  }

  if (!isEmpty(documentMetadata.supportingDocumentMetadata)) {
    documentTitle = applicationContext.getUseCases().generateDocumentTitle({
      applicationContext,
      documentMetadata: documentMetadata.supportingDocumentMetadata,
    });
    store.set(
      state.form.supportingDocumentMetadata.documentTitle,
      documentTitle,
    );
  }

  if (!isEmpty(documentMetadata.secondarySupportingDocumentMetadata)) {
    documentTitle = applicationContext.getUseCases().generateDocumentTitle({
      applicationContext,
      documentMetadata: documentMetadata.secondarySupportingDocumentMetadata,
    });
    store.set(
      state.form.secondarySupportingDocumentMetadata.documentTitle,
      documentTitle,
    );
  }
};
