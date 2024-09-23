import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

export const CreateTermModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.submitCreateTermModalSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validationErrors: state.validationErrors,
  },
  function CreateTermModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validationErrors,
  }) {
    const [isModalMounted, setIsModalMounted] = useState(false);

    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Run Report"
        confirmSequence={confirmSequence}
        title="Create Term"
        onModalMount={() => setIsModalMounted(true)}
      >
        <div className="margin-bottom-4">
          <FormGroup errorText={validationErrors.termName}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-term">
                Term name
              </legend>
              <input
                className="usa-input"
                data-testid="term-name-field"
                id="term-name-field"
                name="termName"
                type="text"
                value={modal.termName}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.term}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-term">
                Trial term
              </legend>
              <select
                aria-label="trial report term"
                className={classNames(
                  'usa-select',
                  validationErrors.term && 'usa-select--error',
                )}
                name="term"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                {/* 10275: the three options below should be the "next" three terms */}
                <option key="winter" value="winter">
                  Winter
                </option>
                <option key="spring" value="spring">
                  Spring
                </option>
                <option key="fall" value="fall">
                  Fall
                </option>
              </select>
            </fieldset>
          </FormGroup>

          <FormGroup>
            <fieldset className="usa-fieldset margin-bottom-0">
              <DateRangePickerComponent
                endDateErrorText={validationErrors.termEndDate}
                endLabel="Term end date"
                endName="termEndDate"
                endPickerCls={'grid-col-6'}
                endValue={modal.termEndDate}
                formGroupCls="margin-bottom-0"
                parentModalHasMounted={isModalMounted}
                rangePickerCls={'grid-row '}
                startDateErrorText={validationErrors.termStartDate}
                startLabel="Term start date"
                startName="termStartDate"
                startPickerCls={'grid-col-6'}
                startValue={modal.termStartDate}
                onChangeEnd={e => {
                  updateModalValueSequence({
                    key: 'termEndDate',
                    value: e.target.value,
                  });
                }}
                onChangeStart={e => {
                  updateModalValueSequence({
                    key: 'termStartDate',
                    value: e.target.value,
                  });
                }}
              />
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

CreateTermModal.displayName = 'CreateTermModal';
