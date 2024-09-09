import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../FileHandlingHelpers/cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { validateFileOnSelect } from '@web-client/views/FileHandlingHelpers/fileValidation';
import React, { useState } from 'react';

type StateDriveFileInputProps = {
  'aria-describedby': string;
  file?: File;
  id: string;
  updateFormValueSequence: string;
  validationSequence: string;
  name: string;
  accept?: string;
  ignoreSizeKey?: boolean;
};

const deps = {
  constants: state.constants,
  form: state.form,
  setIsLoadingSequence: sequences.setIsLoadingSequence,
  setIsNotLoadingSequence: sequences.setIsNotLoadingSequence,
  showErrorModalSequence: sequences.showErrorModalSequence,
  updateFormValueSequence: sequences[props.updateFormValueSequence],
  validationSequence: sequences[props.validationSequence],
};

export const StateDrivenFileInput = connect<
  StateDriveFileInputProps,
  typeof deps
>(
  deps,
  function StateDrivenFileInput({
    accept = '.pdf',
    'aria-describedby': ariaDescribedBy,
    constants,
    file,
    form,
    id,
    ignoreSizeKey,
    name: fileInputName,
    setIsLoadingSequence,
    setIsNotLoadingSequence,
    showErrorModalSequence,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    let inputRef;

    const fileOnForm = file || form[fileInputName] || form.existingFileName;

    // Setting the filename here so that we can display it before validation
    // finishes, otherwise slow machine might have slight lag.
    const [selectedFilename, setSelectedFilename] = useState('');

    const onFileSelectionChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setSelectedFilename(e.target?.files?.[0]?.name || '');
      setIsLoadingSequence();
      await validateFileOnSelect({
        allowedFileExtensions: accept.split(','),
        e,
        megabyteLimit: constants.MAX_FILE_SIZE_MB,
        onError: ({ message }) => {
          setSelectedFilename('');
          showErrorModalSequence({
            errorToLog: !message,
            message,
            title: 'There Is a Problem With Your File',
          });
        },
        onSuccess: ({ selectedFile }) => {
          const { name: inputName } = e.target;
          cloneFile(selectedFile!)
            .then(clonedFile => {
              updateFormValueSequence({
                key: inputName,
                property: 'file',
                value: clonedFile,
              });
              updateFormValueSequence({
                key: ignoreSizeKey ? inputName : `${inputName}Size`,
                property: 'size',
                value: clonedFile.size,
              });
              return validationSequence ? validationSequence() : null;
            })
            .catch(() => {
              /* no-op */
            });
        },
      });
      setIsNotLoadingSequence();
    };

    return (
      <React.Fragment>
        <input
          {...remainingProps}
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className="usa-input"
          data-testid={id}
          id={id}
          name={fileInputName}
          ref={ref => (inputRef = ref)}
          style={{
            display: fileOnForm || selectedFilename ? 'none' : 'block',
          }}
          type="file"
          onChange={onFileSelectionChange}
          onClick={e => {
            if (fileOnForm) e.preventDefault();
          }}
        />

        {(fileOnForm || selectedFilename) && (
          <div>
            <span
              className="success-message icon-upload margin-right-1"
              data-testid={`upload-file-success-${id}`}
            >
              <FontAwesomeIcon icon={'check-circle'} size="1x" />
            </span>
            <span className="mr-1">
              {fileOnForm
                ? fileOnForm.name || form.existingFileName
                : selectedFilename}
            </span>
            <Button
              link
              className={'ustc-button--mobile-inline margin-left-1'}
              onClick={() => {
                updateFormValueSequence({
                  key: fileInputName,
                  property: 'file',
                  value: null,
                });
                updateFormValueSequence({
                  key: 'existingFileName',
                  value: null,
                });
                updateFormValueSequence({
                  key: ignoreSizeKey ? fileInputName : `${fileInputName}Size`,
                  property: 'size',
                  value: null,
                });
                inputRef.value = null;
                inputRef.click();
                setSelectedFilename('');
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
