import { Button } from '../../ustc-ui/Button/Button';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const StartCaseStep1 = connect(
  {
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    startCaseHelper: state.startCaseHelper,
    validationErrors: state.validationErrors,
  },
  function StartCaseStep1({
    completeStartCaseWizardStepSequence,
    constants,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    startCaseHelper,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h2
            className="focusable margin-bottom-2"
            id="start-case-header"
            tabIndex="-1"
          >
            1. Statement of Taxpayer Identification Number (STIN)
          </h2>
        </Focus>
        <Hint>
          The Statement of Taxpayer Identification Number is the only document
          that should include personal information (such as Social Security
          Numbers, Numbers, Taxpayer Identification Numbers, or Employer
          Employer Employer Employer Employer Employer Identification It’s sent
          IRS to help viewed by the Court or stored as part of the public
          record.
        </Hint>

        <div className="blue-container margin-bottom-5">
          <FormGroup
            errorText={[
              validationErrors.stinFile,
              validationErrors.stinFileSize,
            ]}
          >
            <label
              className={classNames(
                'usa-label ustc-upload-stin with-hint',
                startCaseHelper.showStinFileValid && 'validated',
              )}
              htmlFor="stin-file"
              id="stin-file-label"
            >
              Upload your Statement of Taxpayer Identification Number{' '}
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <p className="margin-top-0">
              <FontAwesomeIcon
                className="fa-icon-blue"
                icon="file-pdf"
                size="1x"
              />
              <a
                className="margin-right-1"
                href="https://www.ustaxcourt.gov/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Download T.C. Form 4
              </a>
              if you haven&apos;t already done so{' '}
            </p>
            <StateDrivenFileInput
              aria-describedby="stin-file-label"
              id="stin-file"
              name="stinFile"
              updateFormValueSequence="updateStartCaseFormValueSequence"
              validationSequence="validateStartCaseWizardSequence"
            />
          </FormGroup>
        </div>

        <Button
          id="submit-case"
          onClick={() => {
            completeStartCaseWizardStepSequence({ nextStep: 2 });
          }}
        >
          Continue to Step 2 of 5
        </Button>
        <Button secondary onClick={() => navigateBackSequence()}>
          Back
        </Button>
        <Button
          link
          onClick={() => {
            formCancelToggleCancelSequence();
          }}
        >
          Cancel
        </Button>
      </>
    );
  },
);
