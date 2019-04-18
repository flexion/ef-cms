import { Focus } from '../ustc-ui/Focus/Focus';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ErrorNotificationComponent extends React.Component {
  componentDidUpdate() {
    this.focusNotification();
  }

  focusNotification() {
    const notification = this.notificationRef.current;
    if (notification) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const alertHelper = this.props.alertHelper;
    const alertError = this.props.alertError;

    this.notificationRef = React.createRef();

    return (
      <React.Fragment>
        {alertHelper.showErrorAlert && (
          <div
            className="usa-alert usa-alert-error"
            aria-live="assertive"
            role="alert"
            ref={this.notificationRef}
          >
            <div className="usa-alert-body">
              <Focus>
                <h3 className="usa-alert-heading">{alertError.title}</h3>
              </Focus>
              {alertHelper.showSingleMessage && (
                <p className="usa-alert-text">{alertError.message}</p>
              )}
              {alertHelper.showMultipleMessages && (
                <ul>
                  {alertError.messages.map((message, idx) => (
                    <li key={idx}>{message}</li>
                  ))}
                </ul>
              )}
              {alertHelper.showTitleOnly && (
                <div className="alert-blank-message" />
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

ErrorNotificationComponent.propTypes = {
  alertError: PropTypes.object,
  alertHelper: PropTypes.object,
};

export const ErrorNotification = connect(
  {
    alertError: state.alertError,
    alertHelper: state.alertHelper,
  },
  ErrorNotificationComponent,
);
