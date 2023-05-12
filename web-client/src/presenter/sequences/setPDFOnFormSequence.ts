import { instantiatePDFFromUploadAction } from '../actions/FileDocument/instantiatePDFFromUploadAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const setPDFOnFormSequence = [
  instantiatePDFFromUploadAction,
  setFormValueAction,
];
