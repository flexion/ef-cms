import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ chooseWizardStepSequence, fileDocumentHelper, form }) => {
    return (
      <React.Fragment>
        <div>
          <h3 className="header-with-link-button">
            {form.secondaryDocument.documentTitle}
          </h3>
          <button
            className="link push-right"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'FileDocument' })}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>

        <div className="blue-container">
          <div className="ustc-form-group">
            <label htmlFor="secondary-filing">
              {form.secondaryDocument.documentTitle}
            </label>
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            {form.secondaryDocumentFile.name}
          </div>

          {form.secondarySupportingDocumentFile && (
            <div className="ustc-form-group">
              <label htmlFor="secondary-supporting-documents">
                {form.secondarySupportingDocumentMetadata.documentTitle}
              </label>
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              {form.secondarySupportingDocumentFile.name}
            </div>
          )}

          {fileDocumentHelper.showSecondaryFilingNotIncludes && (
            <div className="ustc-form-group">
              <label htmlFor="filing-not-includes">
                Filing Does Not Include
              </label>
              <ul className="ustc-unstyled-list without-margins">
                {!form.hasSecondarySupportingDocuments && (
                  <li>Supporting Documents</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
