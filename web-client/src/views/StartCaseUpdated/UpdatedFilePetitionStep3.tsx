import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseTypeSelect } from '@web-client/views/StartCase/CaseTypeSelect';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { IrsNoticeUploadForm } from '@web-client/views/StartCaseUpdated/IrsNoticeUploadForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep3 = connect(
  {
    addAnotherIrsNoticeToFormSequence:
      sequences.addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    form: state.form,
    irsNoticeUploadFormInfo: state.irsNoticeUploadFormInfo,
    startCaseHelper: state.startCaseHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep3Sequence:
      sequences.updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep3({
    addAnotherIrsNoticeToFormSequence,
    caseTypeDescriptionHelper,
    form,
    irsNoticeUploadFormInfo,
    startCaseHelper,
    updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionGoBackAStepSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="blue-container margin-bottom-5">
          <div className="usa-form-group">
            <FormGroup errorText={validationErrors.hasIrsNotice}>
              <fieldset
                className="usa-fieldset margin-bottom-0"
                id="irs-notice-radios"
              >
                <legend className="usa-legend" id="notice-legend">
                  {startCaseHelper.noticeLegend}
                </legend>
                <div className="usa-form-group">
                  {['Yes', 'No'].map((option, idx) => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        aria-describedby="notice-legend"
                        checked={form.hasIrsNotice === (option === 'Yes')}
                        className="usa-radio__input"
                        id={`hasIrsNotice-${option}`}
                        name="hasIrsNotice"
                        type="radio"
                        value={option === 'Yes'}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'true',
                          });
                          validationErrors.hasIrsNotice = '';
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        data-testid={`irs-notice-${option}`}
                        htmlFor={`hasIrsNotice-${option}`}
                        id={`hasIrsNotice-${idx}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </FormGroup>

            {startCaseHelper.showHasIrsNoticeOptions && (
              <>
                {irsNoticeUploadFormInfo.map((info, index) => {
                  const irsNotices =
                    (validationErrors.irsNotices as unknown as any[]) || [];

                  const validationError = irsNotices
                    ? irsNotices.find(errors => errors.index === index) || {}
                    : {};
                  return (
                    <>
                      <IrsNoticeUploadForm
                        caseType={info.caseType}
                        file={info.file}
                        index={index}
                        key={info.key}
                        noticeIssuedDate={info.noticeIssuedDate}
                        taxYear={info.taxYear}
                        todayDate={info.todayDate}
                        validationError={validationError}
                      />
                    </>
                  );
                })}
                <Button
                  link
                  onClick={() => addAnotherIrsNoticeToFormSequence()}
                >
                  <Icon
                    className="fa-icon-blue"
                    icon={['fas', 'plus']}
                    size="1x"
                  />
                  Add another IRS Notice
                </Button>
              </>
            )}

            {startCaseHelper.showNotHasIrsNoticeOptions && (
              <CaseTypeSelect
                allowDefaultOption={true}
                caseTypes={caseTypeDescriptionHelper.caseTypes}
                className="margin-bottom-0"
                legend="Which topic most closely matches your complaint with the
                IRS?"
                value={form.caseType}
                onChange={info => {
                  updateFormValueSequence(info);
                  delete validationErrors.caseType;
                }}
              />
            )}
          </div>
        </div>

        <Button
          onClick={() => {
            updatedFilePetitionCompleteStep3Sequence();
          }}
        >
          Next
        </Button>
        <Button
          secondary
          onClick={() => {
            updatedFilePetitionGoBackAStepSequence();
          }}
        >
          Back
        </Button>
        <Button link onClick={() => console.log('Cancel')}>
          Cancel
        </Button>
      </>
    );
  },
);