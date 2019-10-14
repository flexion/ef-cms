import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class EditPractitionersModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: 'edit-counsel-modal',
      confirmLabel: 'Apply Changes',
      title: 'Edit Petitioner Counsel',
    };
  }
  renderBody() {
    const {
      caseDetail,
      form,
      updateFormValueSequence,
      validateEditPractitionersSequence,
      validationErrors,
    } = this.props;

    return (
      <div>
        {form.practitioners.map((practitioner, idx) => (
          <div
            className="border border-base-light padding-2 margin-bottom-2 grid-row"
            key={idx}
          >
            <div className="grid-col-8">
              <label
                className="usa-label"
                htmlFor={`practitioner-representing-${idx}`}
              >
                {practitioner.name} ({practitioner.barNumber})
              </label>
              <div
                className={classNames(
                  'usa-form-group margin-bottom-0',
                  validationErrors &&
                    validationErrors.practitioners &&
                    validationErrors.practitioners[idx] &&
                    validationErrors.practitioners[idx].representingPrimary &&
                    'usa-form-group--error',
                )}
                id={`practitioner-representing-${idx}`}
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend
                    className="usa-legend usa-legend--text-normal"
                    id={`practitioner-representing-legend-${idx}`}
                  >
                    Representing
                  </legend>
                  <div className="usa-checkbox">
                    <input
                      aria-describedby={`practitioner-representing-legend-${idx}`}
                      checked={practitioner.representingPrimary || false}
                      className="usa-checkbox__input"
                      id={`representing-primary-${idx}`}
                      name={`practitioners.${idx}.representingPrimary`}
                      type="checkbox"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateEditPractitionersSequence();
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor={`representing-primary-${idx}`}
                    >
                      {caseDetail.contactPrimary.name}
                    </label>
                  </div>

                  {caseDetail.contactSecondary &&
                    caseDetail.contactSecondary.name && (
                      <div className="usa-checkbox">
                        <input
                          aria-describedby={`practitioner-representing-legend-${idx}`}
                          checked={practitioner.representingSecondary || false}
                          className="usa-checkbox__input"
                          id={`representing-secondary-${idx}`}
                          name={`practitioners.${idx}.representingSecondary`}
                          type="checkbox"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            });
                            validateEditPractitionersSequence();
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor={`representing-secondary-${idx}`}
                        >
                          {caseDetail.contactSecondary.name}
                        </label>
                      </div>
                    )}
                  <Text
                    bind={`validationErrors.practitioners.${idx}.representingPrimary`}
                    className="usa-error-message"
                  />
                </fieldset>
              </div>
            </div>
            <div className="grid-col-4 text-right text-secondary-dark">
              <div className="usa-checkbox">
                <input
                  checked={practitioner.removeFromCase || false}
                  className="usa-checkbox__input"
                  id={`remove-practitioner-${idx}`}
                  name={`practitioners.${idx}.removeFromCase`}
                  type="checkbox"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor={`remove-practitioner-${idx}`}
                >
                  Remove from Case
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export const EditPractitionersModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.caseDetail,
    confirmSequence: sequences.submitEditPractitionersModalSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateEditPractitionersSequence:
      sequences.validateEditPractitionersSequence,
    validationErrors: state.validationErrors,
  },
  EditPractitionersModalComponent,
);
