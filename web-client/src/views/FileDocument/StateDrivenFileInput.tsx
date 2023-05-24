import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../cloneFile';
import { connect } from '@cerebral/react';
import { limitFileSize } from '../limitFileSize';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const StateDrivenFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    constants: state.constants,
    file: props.file,
    fileInputName: props.name,
    form: state.form,
    id: props.id,
    skipPdfValidate: props.skipPdfValidate,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validateFileInputSequence: sequences.validateFileInputSequence,
    validationSequence: sequences[props.validationSequence],
  },
  function StateDrivenFileInput({
    accept = '.pdf',
    ariaDescribedBy,
    constants,
    file,
    fileInputName,
    form,
    id,
    skipPdfValidate,
    updateFormValueSequence,
    validateFileInputSequence,
    validationSequence,
  }) {
    let inputRef;

    const fileOnForm = file || form[fileInputName] || form.existingFileName;

    return (
      <React.Fragment>
        <input
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className="usa-input"
          id={id}
          name={fileInputName}
          ref={ref => (inputRef = ref)}
          style={{
            display: fileOnForm ? 'none' : 'block',
          }}
          type="file"
          onChange={e => {
            const { name: inputName } = e.target;
            limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
              const uploadedFile = e.target.files[0];
              cloneFile(uploadedFile)
                .then(clonedFile => {
                  if (!skipPdfValidate) {
                    return validateFileInputSequence({
                      file: clonedFile,
                      locationOnForm: inputName,
                    });
                  } else {
                    return updateFormValueSequence({
                      key: inputName,
                      value: clonedFile,
                    });
                  }
                })
                .then(() => {
                  return validationSequence();
                })
                .catch(() => {
                  /* no-op */
                });
            });
          }}
          onClick={e => {
            if (fileOnForm) e.preventDefault();
          }}
        />

        {fileOnForm && (
          <div>
            <span
              className="success-message icon-upload margin-right-1"
              data-cy="file-upload-success"
            >
              <FontAwesomeIcon icon="check-circle" size="1x" />
            </span>
            <span className="mr-1">
              {fileOnForm.name || form.existingFileName}
            </span>
            <Button
              link
              className="ustc-button--mobile-inline margin-left-1"
              onClick={() => {
                updateFormValueSequence({
                  key: fileInputName,
                  value: null,
                });
                updateFormValueSequence({
                  key: 'existingFileName',
                  value: null,
                });
                inputRef.value = null;
                inputRef.click();
              }}
            >
              Change
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  },
);

StateDrivenFileInput.displayName = 'StateDrivenFileInput';
