const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfDocketChange = ({
  docketEntryIndex,
  filingParties,
  filingsAndProceedings,
  options,
}) => {
  const showFilingsAndProceedingsChange =
    filingsAndProceedings &&
    filingsAndProceedings.before !== filingsAndProceedings.after;
  const showPartiesChange =
    filingParties && filingParties.before !== filingParties.after;

  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Notice of Docket Change"
      />

      <div className="card margin-top-80">
        <div className="card-header">
          Docket Entry No. {docketEntryIndex} has been changed
        </div>
        <div className="card-content">
          {showFilingsAndProceedingsChange && (
            <div
              className="internal-card-content"
              id="changed-filings-and-proceedings"
            >
              &quot;Entry of Appearance for Petr. Edward Reyes&quot; has been
              changed to &quot; Entry of Appearance for Petr. Edward Reyes and
              then &quot;.
            </div>
          )}
          {showPartiesChange && (
            <div className="internal-card-content" id="changed-filing-parties">
              The filing party/parties has been changed from &quot; Petr. Edward
              Reyes&quot; to &quot; Resp & Petrs. Edward Reyes & Angela Pitts
              &quot;.
            </div>
          )}
        </div>
      </div>

      <p className="float-right width-third">
        Stephanie A. Servoss
        <br />
        Clerk of the Court
      </p>
    </>
  );
};
