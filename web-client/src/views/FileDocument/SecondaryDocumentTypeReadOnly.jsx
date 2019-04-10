import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from './NonstandardForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentTypeReadOnly = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    editSelectedSecondaryDocumentSequence:
      sequences.editSelectedSecondaryDocumentSequence,
    form: state.form,
    selectDocumentTypeHelper: state.selectDocumentTypeHelper,
  },
  ({
    closeDocumentCategoryAccordionSequence,
    form,
    editSelectedSecondaryDocumentSequence,
    selectDocumentTypeHelper,
  }) => {
    return (
      <div className="ustc-form-group">
        <div>
          <label htmlFor="category" className="inline-block mr-1">
            Selected Secondary Document Type
          </label>
          <button
            className="link"
            id="edit-selected-secondary-document-type"
            onClick={() => {
              closeDocumentCategoryAccordionSequence();
              editSelectedSecondaryDocumentSequence();
            }}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>
        <div>
          <p>{form.secondaryDocument.documentType}</p>
        </div>
        {selectDocumentTypeHelper.secondary.showNonstandardForm && (
          <NonstandardForm
            level="secondary"
            namespace="secondaryDocument"
            validationErrors="validationErrors.secondaryDocument"
          />
        )}
      </div>
    );
  },
);
