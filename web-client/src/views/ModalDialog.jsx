import { Button } from '../ustc-ui/Button/Button';
import { FocusLock } from '../ustc-ui/FocusLock/FocusLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const modalRoot = document.getElementById('modal-root');

export class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');

    this.modal = {};
    this.preventCancelOnBlur = !!this.props.preventCancelOnBlur;
    this.preventScrolling =
      this.props.preventScrolling !== undefined
        ? this.props.preventScrolling
        : true;
    this.blurDialog = this.blurDialog.bind(this);
    this.keydownTriggered = this.keydownTriggered.bind(this);
    if (this.runCancelSequence) {
      this.runCancelSequence = this.runCancelSequence.bind(this);
    }
    this.toggleNoScroll = this.toggleNoScroll.bind(this);
    this.runConfirmSequence = this.runConfirmSequence.bind(this);
  }
  toggleNoScroll(scrollingOn) {
    if (this.preventScrolling && scrollingOn) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    }
  }

  runCancelSequence(event) {
    event.stopPropagation();
    this.props.cancelSequence.call();
  }
  runConfirmSequence(event) {
    event.stopPropagation();
    this.props.confirmSequence.call();
  }
  keydownTriggered(event) {
    if (event.keyCode === 27) {
      return this.blurDialog(event);
    }
  }
  touchmoveTriggered(event) {
    return event.preventDefault();
  }
  blurDialog(event) {
    if (this.preventCancelOnBlur) {
      return false;
    }
    return this.runCancelSequence(event);
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
    this.focusModal();
    if (this.modalMounted) {
      this.modalMounted();
    }
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    document.removeEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(false);
  }

  focusModal() {
    const modalHeader = document.querySelector(
      '.modal-header .modal-header__title',
    );
    modalHeader && modalHeader.focus();
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    const { modal } = this;
    return (
      <FocusLock>
        <dialog
          open
          className="modal-screen"
          role="dialog"
          onClick={this.blurDialog}
        >
          <div
            aria-live={this.ariaLiveMode || 'assertive'}
            aria-modal="true"
            className={classNames('modal-dialog padding-205', modal.classNames)}
            role="status"
            onClick={event => event.stopPropagation()}
          >
            <div className="modal-header grid-container padding-x-0">
              <div className="grid-row">
                <div className="mobile-lg:grid-col-9">
                  <h3 className="modal-header__title" tabIndex="-1">
                    {modal.title}
                  </h3>
                </div>
                <div className="mobile-lg:grid-col-3">
                  <Button
                    link
                    className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                    onClick={this.runCancelSequence}
                  >
                    Close
                    <FontAwesomeIcon
                      className="margin-right-0 margin-left-1"
                      icon="times-circle"
                    />
                  </Button>
                </div>
              </div>
            </div>
            {modal.message && (
              <p className="margin-bottom-5">{modal.message}</p>
            )}
            {this.renderBody && this.renderBody()}
            <Button onClick={this.runConfirmSequence}>
              {modal.confirmLabel}
            </Button>
            {modal.cancelLabel && (
              <Button secondary onClick={this.runCancelSequence}>
                {modal.cancelLabel}
              </Button>
            )}
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

ModalDialog.propTypes = {
  cancelSequence: PropTypes.func,
  confirmSequence: PropTypes.func,
  modal: PropTypes.object,
  preventCancelOnBlur: PropTypes.bool,
  preventScrolling: PropTypes.bool,
};
