import { Focus } from '../../ustc-ui/Focus/Focus';
import { PartiesRepresenting } from './PartiesRepresenting';
import { RequestAccessDocumentForm } from './RequestAccessDocumentForm';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { find } from 'lodash';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccess = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    requestAccessHelper: state.requestAccessHelper,
    reviewRequestAccessInformationSequence:
      sequences.reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    requestAccessHelper,
    formCancelToggleCancelSequence,
    reviewRequestAccessInformationSequence,
    validationErrors,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
  }) => {
    return (
      <React.Fragment>
        <Focus>
          <h1 tabIndex="-1" id="file-a-document-header">
            Request Access to This Case
          </h1>
        </Focus>
        <p className="required-statement margin-top-05 margin-bottom-5">
          All fields required unless otherwise noted
        </p>
        <div>
          <h2 className="header-with-link-button">
            Type of Document You’re Filing
          </h2>
        </div>
        <div className="blue-container">
          <div
            className={`usa-form-group margin-bottom-0 ${
              validationErrors.documentType ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              htmlFor="document-type"
              id="document-type-label"
              className="usa-label"
            >
              Document Type
            </label>
            <select
              name="documentType"
              id="document-type"
              aria-describedby="document-type-label"
              className={`usa-select ${
                validationErrors.documentType ? 'usa-select--error' : ''
              }`}
              onChange={e => {
                const documentType = e.target.value;
                const entry = find(requestAccessHelper.documents, {
                  documentType,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'documentType',
                  value: documentType || '',
                });
                updateCaseAssociationFormValueSequence({
                  key: 'documentTitleTemplate',
                  value: entry.documentTitleTemplate,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'eventCode',
                  value: entry.eventCode,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'scenario',
                  value: entry.scenario,
                });
                validateCaseAssociationRequestSequence();
              }}
              value={form.documentType || ''}
            >
              <option value="">- Select -</option>
              {requestAccessHelper.documents.map(entry => {
                return (
                  <option key={entry.documentType} value={entry.documentType}>
                    {entry.documentType}
                  </option>
                );
              })}
            </select>
            <Text
              className="usa-error-message"
              bind="validationErrors.documentType"
            />
          </div>
        </div>
        <RequestAccessDocumentForm />
        <PartiesRepresenting />
        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              reviewRequestAccessInformationSequence();
            }}
          >
            Review Filing
          </button>
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  },
);
