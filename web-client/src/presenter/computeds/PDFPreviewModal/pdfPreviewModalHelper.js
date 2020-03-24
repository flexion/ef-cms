import { state } from 'cerebral';

export const pdfPreviewModalHelper = get => {
  const { currentPage, error, totalPages } = get(state.modal.pdfPreviewModal);

  return {
    disableLeftButtons: currentPage === 1,
    disableRightButtons: currentPage === totalPages,
    displayErrorText: !!error,
  };
};
