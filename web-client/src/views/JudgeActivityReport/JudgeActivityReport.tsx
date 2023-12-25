import { BigHeader } from '../BigHeader';
import { CaseWorksheets } from '@web-client/views/JudgeActivityReport/CaseWorksheets';
import { ErrorNotification } from '../ErrorNotification';
import { Statistics } from '@web-client/views/JudgeActivityReport/Statistics';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    judgeActivityReport: state.judgeActivityReport,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    judgeActivityReportJudges: state.judges,
    setJudgeActivityReportFiltersSequence:
      sequences.setJudgeActivityReportFiltersSequence,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
  },
  function JudgeActivityReport({
    judgeActivityReport,
    judgeActivityReportHelper,
    judgeActivityReportJudges,
    setJudgeActivityReportFiltersSequence,
    submitJudgeActivityReportSequence,
  }) {
    return (
      <>
        <BigHeader text="Reports" />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <div className="title">
            <h1>Activity - {judgeActivityReportHelper.reportHeader}</h1>
          </div>

          <JudgeDropdown
            judgeName={judgeActivityReport.judgeName}
            judges={judgeActivityReportJudges}
            setJudgeActivityReportFiltersSequence={
              setJudgeActivityReportFiltersSequence
            }
            submitJudgeActivityReportSequence={
              submitJudgeActivityReportSequence
            }
          />

          <>
            <Tabs>
              <Tab tabName="statistics" title="Statistics">
                <Statistics />
              </Tab>

              <Tab
                tabName="caseWorksheet"
                title={'Submitted/CAV (10)'}
                // title={`Submitted/CAV (${judgeActivityReportHelper.caseWorksheetsFormatted.length})`}
              >
                <CaseWorksheets />
              </Tab>

              <Tab
                tabName="pendingMotions"
                title={'Pending Motions (10)'}
                // title={`Pending Motions (${judgeActivityReportHelper.formattedPendingMotions.length})`}
              >
                <>Pending motions</>
                {/* <PendingMotion /> */}
              </Tab>
            </Tabs>
          </>
        </section>
      </>
    );
  },
);

function JudgeDropdown({
  judgeName,
  judges,
  setJudgeActivityReportFiltersSequence,
  submitJudgeActivityReportSequence,
}) {
  return (
    <div className="grid-col-auto margin-x-3">
      <label
        className="usa-label"
        htmlFor="judge-selection"
        id="judge-selection-label"
      >
        Judge
      </label>
      <select
        aria-describedby="judge-selection-label"
        aria-label="judge"
        className="usa-select select-left width-card-lg"
        name="associatedJudge"
        value={judgeName}
        onChange={e => {
          const selectedJudgeName = e.target.value;
          setJudgeActivityReportFiltersSequence({
            judgeName: selectedJudgeName,
          });
          submitJudgeActivityReportSequence(selectedJudgeName);
        }}
      >
        <option key="all" value="All Judges">
          All Judges
        </option>
        <option key="All Regular Judges" value="All Regular Judges">
          All Regular Judges
        </option>
        <option key="All Senior Judges" value="All Senior Judges">
          All Senior Judges
        </option>
        <option key="All Special Trial Judges" value="All Special Trial Judges">
          All Special Trial Judges
        </option>
        {(judges || []).map(judge => (
          <option key={judge.name} value={judge.name}>
            {judge.name}
          </option>
        ))}
      </select>
    </div>
  );
}
