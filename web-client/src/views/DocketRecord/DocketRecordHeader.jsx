import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  ({
    caseDetail,
    helper,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) => {
    return (
      <React.Fragment>
        <div className="grid-container padding-0">
          <div className="grid-row">
            <div className="tablet:grid-col-8">
              {helper.showAddDocketEntryButton && (
                <a
                  className="usa-button tablet-full-width"
                  href={`/case-detail/${
                    caseDetail.docketNumber
                  }/add-docket-entry`}
                  id="button-add-record"
                >
                  <FontAwesomeIcon icon="plus-circle" /> Add Docket Entry
                </a>
              )}
              {helper.showFileDocumentButton && (
                <a
                  className="usa-button tablet-full-width"
                  href={`/case-detail/${
                    caseDetail.docketNumber
                  }/file-a-document`}
                  id="button-file-document"
                >
                  <FontAwesomeIcon icon="plus-circle" /> File a Document
                </a>
              )}
            </div>
            <div className="tablet:grid-offset-2 tablet:grid-col-2">
              <div className="only-large-screens">
                <select
                  name={`docketRecordSort.${caseDetail.caseId}`}
                  className="usa-select"
                  aria-label="docket record sort"
                  value={caseDetail.docketRecordSort}
                  onChange={e => {
                    updateSessionMetadataSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                >
                  {[
                    {
                      label: 'Oldest',
                      value: 'byDate',
                    },
                    {
                      label: 'Newest',
                      value: 'byDateDesc',
                    },
                    {
                      label: 'Index (Ascending)',
                      value: 'byIndex',
                    },
                    {
                      label: 'Index (Descending)',
                      value: 'byIndexDesc',
                    },
                  ].map(item => (
                    <option key={item.value} value={item.value}>
                      Sort By {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="only-small-screens">
                <button
                  aria-label="docket record sort"
                  className="link mobile-sort-docket-button border-0"
                  onClick={() => {
                    toggleMobileDocketSortSequence();
                  }}
                >
                  {caseDetail.docketRecordSort === 'byDate' &&
                    'Oldest to Newest'}
                  {caseDetail.docketRecordSort === 'byDateDesc' &&
                    'Newest to Oldest'}
                  {caseDetail.docketRecordSort === 'byIndex' &&
                    'Order Ascending'}
                  {caseDetail.docketRecordSort === 'byIndexDesc' &&
                    'Order Descending'}
                  <FontAwesomeIcon icon="sort" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
