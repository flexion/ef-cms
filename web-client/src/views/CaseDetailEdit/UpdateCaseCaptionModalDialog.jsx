import { ModalDialog } from '../modals/ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class UpdateCaseCaptionModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Save',
      title: 'Edit Case Caption',
    };
  }
  renderBody() {
    return (
      <div>
        <label htmlFor="caption" className="usa-label">
          Case Caption
        </label>
        <textarea
          id="caption"
          className="caption usa-textarea"
          defaultValue={this.props.caseCaption}
          aria-labelledby="caption-label"
          onChange={e =>
            this.props.setCaseCaptionSequence({ caseCaption: e.target.value })
          }
        />
        v. Commissioner of Internal Revenue, Respondent
      </div>
    );
  }
}

export const UpdateCaseCaptionModalDialog = connect(
  {
    cancelSequence: sequences.dismissCaseCaptionModalSequence,
    caseCaption: state.caseCaption,
    confirmSequence: sequences.updateCaseDetailSequence,
    setCaseCaptionSequence: sequences.setCaseCaptionSequence,
  },
  UpdateCaseCaptionModalDialogComponent,
);
