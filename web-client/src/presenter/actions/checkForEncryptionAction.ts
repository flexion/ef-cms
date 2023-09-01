import { checkForEncryption } from '../../views/checkForEncryption';

export const checkForEncryptionAction = async ({
  path,
  props,
}: ActionProps) => {
  const { file } = props;

  const isFileEncrypted = await checkForEncryption(file);

  if (!isFileEncrypted) {
    return path.valid();
  } else {
    return path.invalid({
      alertError: {
        message:
          'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
        title: 'Please correct the following errors on the page:',
      },
    });
  }
};
