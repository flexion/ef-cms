import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const UpcomingTrialSessions = connect(
  {
    formattedTrialSessions: state.formattedTrialSessions.formattedSessions,
    trialCities: state.constants.TRIAL_CITIES,
    trialSessionTypes: state.constants.TRIAL_SESSION_TYPES,
  },
  ({ formattedTrialSessions, trialCities, trialSessionTypes }) => {
    return (
      <React.Fragment>
        <div className="grid-row margin-bottom-3">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                <h3>Filter by</h3>
              </div>
              <div className="grid-col-3">
                <BindedSelect bind="screenMetadata.trialSessionFilters.sessionType">
                  <option value="">-Session Type-</option>
                  {trialSessionTypes.map(sessionType => (
                    <option key={sessionType} value={sessionType}>
                      {sessionType}
                    </option>
                  ))}
                </BindedSelect>
              </div>
              <div className="grid-col-3">
                <BindedSelect bind="screenMetadata.trialSessionFilters.trialLocation">
                  <option value="">-Location-</option>
                  {trialCities.ALL.map(trialCity => {
                    const trialLocation = `${trialCity.city}, ${trialCity.state}`;
                    return (
                      <option key={trialLocation} value={trialLocation}>
                        {trialLocation}
                      </option>
                    );
                  })}
                </BindedSelect>
              </div>
              <div className="grid-col-3">
                <BindedSelect bind="screenMetadata.trialSessionFilters.judge">
                  <option value="">-Judge-</option>
                  <option value="Judge Judy">Judge Judy</option>
                  <option value="Judge Smith">Judge Smith</option>
                  <option value="Judge Dredd">Judge Dredd</option>
                  <option value="Judge Arnold">Judge Arnold</option>
                </BindedSelect>
              </div>
            </div>
          </div>
        </div>
        <table
          aria-label="upcoming trial sessions"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th aria-hidden="true" className="icon-column" />
              <th>Location</th>
              <th>Type</th>
              <th>Judge</th>
              <th aria-label="Number of cases">No. of Cases</th>
            </tr>
          </thead>
          {formattedTrialSessions.map((trialDate, idxDate) => (
            <React.Fragment key={idxDate}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan="6">
                    <h4 className="margin-bottom-0">
                      {trialDate.dateFormatted}
                    </h4>
                  </td>
                </tr>
              </tbody>
              {trialDate.sessions.map((item, idx) => (
                <tbody key={idx}>
                  <tr className="trial-sessions-row">
                    <td>{item.formattedStartDate}</td>
                    <td aria-hidden="true">
                      {item.swingSession && (
                        <FontAwesomeIcon
                          className="fa-icon-blue"
                          icon="link"
                          size="sm"
                        />
                      )}
                    </td>
                    <td>
                      <a href={`/trial-session-detail/${item.trialSessionId}`}>
                        {item.trialLocation}
                      </a>
                    </td>
                    <td>{item.sessionType}</td>
                    <td>{item.judge}</td>
                    <td>{item.maxCases}</td>
                  </tr>
                </tbody>
              ))}
            </React.Fragment>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
