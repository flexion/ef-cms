import { JudgeOptions } from './JudgeOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SessionAssignmentsForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  ({ form, updateTrialSessionFormDataSequence }) => {
    return (
      <>
        <h2 className="margin-top-4">Session Assignments</h2>
        <div className="blue-container">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="judge" id="judge-label">
              Judge <span className="usa-hint">(optional)</span>
            </label>
            <select
              aria-describedby="judge-label"
              className="usa-select"
              id="judge"
              name="judge"
              value={form.judge || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              <JudgeOptions />
            </select>
          </div>

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="trial-clerk"
              id="trial-clerk-label"
            >
              Trial Clerk <span className="usa-hint">(optional)</span>
            </label>
            <select
              aria-describedby="trial-clerk-label"
              className="usa-select"
              id="trial-clerk"
              name="trialClerk"
              value={form.trialClerk || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {/* hardcoding these for #1191 - will be dynamic at some point */}
              <option value="Bob Barker">Bob Barker</option>
              <option value="Bill Dance">Bill Dance</option>
              <option value="Jerry Seinfeld">Jerry Seinfeld</option>
            </select>
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="court-reporter">
              Court Reporter <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="court-reporter"
              name="courtReporter"
              type="text"
              value={form.courtReporter || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="irs-calendar-administrator">
              IRS Calendar Administrator{' '}
              <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="irs-calendar-administrator"
              name="irsCalendarAdministrator"
              type="text"
              value={form.irsCalendarAdministrator || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </>
    );
  },
);
