import { state } from 'cerebral';

/**
 * TODO
 */
export const validateFileAction = async ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const { theNameOfTheFileOnTheEntity } = props;
  const form = get(state.form);

  const errors = await applicationContext.getUseCases().validateFileInteractor({
    pdf: form[theNameOfTheFileOnTheEntity],
  });

  if (errors) {
    return path.error({
      errors: {
        primaryDocumentPDF:
          'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
      },
    });
  }

  return path.success();
};
