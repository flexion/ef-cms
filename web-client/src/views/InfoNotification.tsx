import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const InfoNotificationComponent = function InfoNotificationComponent({
  alertInfo,
  dismissAlertSequence = sequences.dismissAlertSequence,
  dismissible = true,
  iconRight = true,
  messageNotBold = false,
  scrollToTop = true,
}: {
  alertInfo: {
    title?: string;
    linkUrl?: string;
    linkText?: string;
    message?: string | React.ReactNode;
    dismissText?: string;
    dismissIcon?: string;
  };
  dismissible?: boolean;
  dismissAlertSequence?: Function;
  messageNotBold?: boolean;
  scrollToTop?: boolean;
  iconRight?: boolean;
}) {
  const notificationRef = useRef(null);
  const isMessageOnly = alertInfo && alertInfo.message && !alertInfo.title;

  useEffect(() => {
    const notification = notificationRef.current;
    if (notification && scrollToTop) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <>
      {alertInfo && (
        <div
          aria-live="polite"
          className={classNames(
            'usa-alert',
            'usa-alert--info',
            isMessageOnly && 'usa-alert-info-message-only',
          )}
          data-testid="info-alert"
          ref={notificationRef}
          role="alert"
        >
          <div
            className={classNames(
              'usa-alert__body',
              alertInfo.dismissText && 'padding-right-6',
            )}
          >
            <div className="grid-container padding-x-0">
              <div className="grid-row">
                <div className="tablet:grid-col-10">
                  {alertInfo.title && (
                    <p className="usa-alert__heading padding-top-0">
                      {alertInfo.title}
                    </p>
                  )}
                  <p
                    className={classNames(
                      'usa-alert__text',
                      messageNotBold && 'font-weight-normal',
                    )}
                  >
                    {alertInfo.message}
                  </p>
                  {alertInfo.linkUrl && (
                    <Button
                      link
                      className="padding-0 margin-top-2"
                      href={alertInfo.linkUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {alertInfo.linkText || alertInfo.linkUrl}
                    </Button>
                  )}
                </div>
                <div className="tablet:grid-col-2 usa-alert__action">
                  {dismissible && (
                    <Button
                      link
                      className="no-underline padding-0"
                      icon={alertInfo.dismissIcon || 'times-circle'}
                      iconRight={iconRight}
                      onClick={() => dismissAlertSequence()}
                    >
                      {alertInfo.dismissText || 'Clear'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type InfoNotificationProps = {
  isDismissible?: boolean;
};

const infoNotificationDeps = {
  alertInfo: state.alertInfo,
  dismissAlertSequence: sequences.dismissAlertSequence,
};

export const InfoNotification = connect<
  InfoNotificationProps,
  typeof infoNotificationDeps
>(
  infoNotificationDeps,
  function InfoNotification({
    alertInfo,
    dismissAlertSequence,
    isDismissible = true,
  }) {
    if (alertInfo) {
      return (
        <InfoNotificationComponent
          alertInfo={alertInfo}
          dismissAlertSequence={dismissAlertSequence}
          dismissible={isDismissible}
        />
      );
    } else {
      return null;
    }
  },
);

InfoNotification.displayName = 'InfoNotification';