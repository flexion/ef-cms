import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class AddRespondentModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Add to Case',
      title: 'Add Respondent Counsel',
    };
  }

  renderBody() {
    return (
      <div className="ustc-add-counsel-modal">
        <div
          className={classNames(
            'usa-form-group',
            this.props.validationErrors.user && 'usa-form-group--error',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              Counsel Match(es) Found
            </legend>

            {this.props.modal.respondentMatches &&
              this.props.modal.respondentMatches.length === 1 && (
                <span>
                  {this.props.modal.respondentMatches[0].name} (
                  {this.props.modal.respondentMatches[0].barNumber}
                  )
                  <br />
                  {this.props.modal.respondentMatches[0].addressLine2}
                </span>
              )}

            {this.props.modal.respondentMatches &&
              this.props.modal.respondentMatches.length > 1 &&
              this.props.modal.respondentMatches.map((counsel, idx) => (
                <div className="usa-radio" key={idx}>
                  <input
                    aria-describedby="counsel-matches-legend"
                    checked={
                      (this.props.modal.user &&
                        this.props.modal.user.userId === counsel.userId) ||
                      false
                    }
                    className="usa-radio__input"
                    id={`counsel-${idx}`}
                    name="user"
                    type="radio"
                    onChange={e => {
                      this.props.updateModalValueSequence({
                        key: e.target.name,
                        value: counsel,
                      });
                      this.props.validateSequence();
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`counsel-${idx}`}
                  >
                    {counsel.name} ({counsel.barNumber})
                    <br />
                    {counsel.addressLine2}
                  </label>
                </div>
              ))}
            <Text bind="validationErrors.user" className="usa-error-message" />
          </fieldset>
        </div>
      </div>
    );
  }
}

export const AddRespondentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.formattedCaseDetail,
    confirmSequence: sequences.associateRespondentWithCaseSequence,
    constants: state.constants,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddRespondentSequence,
    validationErrors: state.validationErrors,
  },
  AddRespondentModalComponent,
);
