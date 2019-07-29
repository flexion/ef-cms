import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';

export const PrintableDocketRecord = connect(
  {
    caseDetail: state.formattedCaseDetail,
    gotoCaseDetail: sequences.gotoCaseDetailSequence,
  },
  ({ caseDetail, gotoCaseDetail }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="heading-2 captioned" tabIndex="-1">
                  Docket Number: {caseDetail.docketNumberWithSuffix}
                </h1>
                <p className="margin-0">{caseDetail.caseTitle}</p>
              </div>
              <div className="tablet:grid-col-6"></div>
            </div>
          </div>
        </div>
        <div className="grid-container print-docket-record">
          <button
            className="usa-button usa-button--unstyled margin-bottom-3"
            onClick={() => {
              gotoCaseDetail({
                docketNumber: caseDetail.docketNumber,
              });
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Case
          </button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
