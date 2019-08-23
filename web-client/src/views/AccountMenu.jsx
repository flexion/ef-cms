import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export class AccountMenuComponent extends React.Component {
  constructor(props) {
    super(props);

    this.resetHeaderAccordionsSequence = props.resetHeaderAccordionsSequence;

    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClickOutside();
  }

  handleClickOutside() {
    this.resetHeaderAccordionsSequence();
  }

  render() {
    const { isExpanded, signOutSequence, toggleAccountMenu, user } = this.props;

    return (
      <ul
        className="usa-nav__primary usa-accordion"
        ref={node => (this.node = node)}
      >
        <li
          className={classNames(
            'usa-nav__primary-item',
            isExpanded && 'usa-nav__submenu--open',
          )}
        >
          <button
            aria-expanded={isExpanded}
            className={classNames(
              'usa-accordion__button usa-nav__link hidden-underline',
            )}
            title={`Hello, ${user.name}`}
            onClick={() => toggleAccountMenu()}
          >
            <span>
              <FontAwesomeIcon
                className="account-menu-icon"
                icon={['far', 'user']}
              />
            </span>
          </button>
          {isExpanded && (
            <ul className="usa-nav__submenu position-right-0">
              <li className="usa-nav__submenu-item">
                <button
                  className="account-menu-item usa-button usa-button--unstyled"
                  id="log-out"
                  onClick={() => signOutSequence()}
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    );
  }
}

AccountMenuComponent.propTypes = {
  isExpanded: PropTypes.bool,
  resetHeaderAccordionsSequence: PropTypes.func,
  signOutSequence: PropTypes.func,
  toggleAccountMenu: PropTypes.func,
  user: PropTypes.object,
};

export const AccountMenu = connect(
  {
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    signOutSequence: sequences.signOutSequence,
    toggleAccountMenu: sequences.toggleAccountMenuSequence,
    user: state.user,
  },
  AccountMenuComponent,
);
