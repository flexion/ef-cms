import { state } from 'cerebral';

/**
 * creates the default success alert object
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alertSuccess object with default strings
 */
export const getFileExternalDocumentAlertSuccessAction = ({ get, props }) => {
  if (props.documentWithPendingAssociation) {
    return {
      alertSuccess: {
        message:
          'If approved, you will gain full access to this case. Please check your dashboard for updates.',
        title: 'Your filing has been successfully submitted.',
      },
    };
  }

  const documentToEdit = get(state.documentToEdit);
  if (documentToEdit) {
    return {
      alertSuccess: {
        message: 'You can view the updated document below.',
        title: 'Your changes have been saved.',
      },
    };
  }

  let message =
    'You can access your documents at any time from the docket record below.';

  if (props.printReceiptLink) {
    message = `You can <a href="${props.printReceiptLink}">print a receipt</a> for your filing or access your documents at any time from the docket record below.`;
  }

  return {
    alertSuccess: {
      message,
      title: 'Your filing has been successfully submitted.',
    },
  };
};
