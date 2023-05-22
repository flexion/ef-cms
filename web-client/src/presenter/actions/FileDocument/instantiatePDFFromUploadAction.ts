import { PDF } from '../../../../../shared/src/business/entities/documents/PDF';

/**
 * TODO
 */
export const instantiatePDFFromUploadAction = async ({
  applicationContext,
  props,
}) => {
  const { file, locationOnForm } = props;

  const pdf: PDF = await applicationContext
    .getUseCases()
    .createPDFFromUploadInteractor(applicationContext, {
      file,
    });

  return { key: locationOnForm, value: pdf };
};
