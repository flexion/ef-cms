import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PetitionFormResponse = connect(
  {
    count: props.count,
    form: state.form,
    id: props.id,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    removeFactOrReasonSequence: sequences.removeFactOrReasonSequence,
    textName: props.textName,
    updatePetitionFormValueSequence: sequences.updatePetitionFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PetitionFormResponse({
    count,
    form,
    id,
    petitionGenerationLiveValidationSequence,
    removeFactOrReasonSequence,
    textName,
    updatePetitionFormValueSequence,
    validationErrors,
  }) {
    const KEY = `${textName}[${count}]`;

    return (
      <FormGroup
        className="autogenerate-petition-form"
        errorText={validationErrors[KEY]}
      >
        <div className="fact-or-reason">
          {/* TODO: move to scss */}
          <li
            style={{
              fontWeight: 600,
              listStyleType: 'lower-alpha',
            }}
          >
            <NonMobile>
              <div style={{ display: 'flex' }}>
                <div>
                  <textarea
                    aria-describedby={`${id}-label`}
                    className="usa-textarea max-width-unset"
                    id={id}
                    name={textName}
                    style={{ marginTop: '0px' }}
                    value={form[textName][count] || ''}
                    onBlur={() => {
                      petitionGenerationLiveValidationSequence({
                        step: 1,
                        validationKey: [KEY],
                      });
                    }}
                    onChange={e => {
                      updatePetitionFormValueSequence({
                        index: count,
                        key: e.target.name,
                        value: e.target.value,
                      });
                      delete validationErrors[KEY];
                    }}
                  />
                </div>
                {count > 0 && (
                  <Button
                    link
                    className="reason-button"
                    icon="times"
                    onClick={() =>
                      removeFactOrReasonSequence({
                        index: count,
                        key: textName,
                      })
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </NonMobile>

            <Mobile>
              <div>
                <textarea
                  aria-describedby={`${id}-label`}
                  className="usa-textarea"
                  id={id}
                  name={textName}
                  style={{ marginTop: '0px', width: '100%' }}
                  value={form[textName][count] || ''}
                  onBlur={() => {
                    petitionGenerationLiveValidationSequence({
                      step: 1,
                      validationKey: [KEY],
                    });
                  }}
                  onChange={e => {
                    updatePetitionFormValueSequence({
                      index: count,
                      key: e.target.name,
                      value: e.target.value,
                    });
                    delete validationErrors[KEY];
                  }}
                />
              </div>
              {count > 0 && (
                <Button
                  link
                  className="reason-button"
                  icon="times"
                  onClick={() =>
                    removeFactOrReasonSequence({
                      index: count,
                      key: textName,
                    })
                  }
                >
                  Remove
                </Button>
              )}
            </Mobile>
          </li>
        </div>
      </FormGroup>
    );
  },
);

PetitionFormResponse.displayName = 'PetitionFormResponse';