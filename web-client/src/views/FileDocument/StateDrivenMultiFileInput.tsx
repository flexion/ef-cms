import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StateDrivenMultiFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    constants: state.constants,
    file: props.file,
    fileInputName: props.name,
    form: state.form,
    id: props.id,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validationSequence: sequences[props.validationSequence],
  },
  function StateDrivenFileInput({
    accept = '.pdf',
    ariaDescribedBy,
    constants,
    customClassName = 'usa-input',
    file,
    fileInputName,
    form,
    id,
    multiple,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    let inputRef;

    const fileOnForm = file || form[fileInputName] || form.existingFileName;

    return (
      <React.Fragment>
        <input
          {...remainingProps}
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className={customClassName}
          data-testid={id}
          id={id}
          multiple={!!multiple} // is 'false' a possible option for multiple?? from the docs, its true or undefined
          name={fileInputName}
          ref={ref => (inputRef = ref)}
          style={{
            display: fileOnForm ? 'none' : 'block',
          }}
          type="file"
          onChange={e => {
            const { files, name: inputName } = e.target;
            const validatedFiles: any = [];
            Array.from(files!).forEach(capturedFile => {
              // validate size;
              if (
                capturedFile.size >=
                constants.MAX_FILE_SIZE_MB * 1024 * 1024
              ) {
                alert('file n is too big'); // todo: what's the message
                return false;
              }

              cloneFile(capturedFile)
                .then(clonedFile => {
                  validatedFiles.push({
                    file: clonedFile,
                    fileSize: capturedFile.size,
                  });
                })
                .catch(() => {
                  /* no-op */
                });
            });

            updateFormValueSequence({
              key: inputName,
              value: validatedFiles,
            });

            validationSequence();
          }}
          onClick={e => {
            if (fileOnForm) e.preventDefault();
          }}
        />

        {fileOnForm && (
          <div>
            <span
              className="success-message icon-upload margin-right-1"
              data-testid="upload-file-success"
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

StateDrivenMultiFileInput.displayName = 'StateDrivenMultiFileInput';
