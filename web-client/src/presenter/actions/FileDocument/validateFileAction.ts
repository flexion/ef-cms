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
  const { locationOnForm } = props;
  const pdf = get(state.form[locationOnForm]);

  const errors = await applicationContext.getUseCases().validateFileInteractor({
    pdf,
  });

  if (errors) {
    return path.error({
      errors: {
        primaryDocumentFile:
          'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
      },
    });
  }

  return path.success();
};
