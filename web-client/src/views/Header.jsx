import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state, sequences } from 'cerebral';
import React from 'react';
import SearchBox from './SearchBox';

import close from '../../node_modules/uswds/dist/img/close.svg';

export const Header = connect(
  {
    mobileMenu: state.mobileMenu,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
    signOutSequence: sequences.signOutSequence,
    user: state.user,
  },
  ({ user, mobileMenu, toggleMobileMenuSequence, signOutSequence }) => {
    return (
      <header className="usa-header usa-header-extended" role="banner">
        <div className="usa-navbar">
          <div className="usa-logo" id="extended-logo">
            <em className="usa-logo-text">
              <a href="/">United States Tax Court</a>
            </em>
          </div>
          <button
            className="usa-menu-btn"
            onClick={() => toggleMobileMenuSequence()}
          >
            Menu
          </button>
        </div>

        <nav
          role="navigation"
          className={mobileMenu.isVisible ? 'usa-nav is-visible' : 'usa-nav'}
        >
          <div className="usa-nav-inner">
            <button
              className="usa-nav-close"
              onClick={() => toggleMobileMenuSequence()}
            >
              <img src={close} alt="close" />
            </button>
            {/* <ul className="usa-nav-primary usa-accordion">
              <li>
                <button
                  className="usa-accordion-button usa-nav-link"
                  aria-expanded="false"
                  aria-controls="extended-nav-section-one"
                >
                  <span>Section title</span>
                </button>
                <ul
                  id="extended-nav-section-one"
                  className="usa-nav-submenu"
                  aria-hidden="true"
                >
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  className="usa-accordion-button usa-nav-link"
                  aria-expanded="false"
                  aria-controls="extended-nav-section-two"
                >
                  <span>Simple terms</span>
                </button>
                <ul
                  id="extended-nav-section-two"
                  className="usa-nav-submenu"
                  aria-hidden="true"
                >
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                  <li>
                    <a href="/">Subsection title</a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="usa-nav-link" href="/">
                  <span>Distinct from each other</span>
                </a>
              </li>
            </ul> */}
            {user && (
              <div className="usa-nav-secondary">
                <ul className="usa-unstyled-list usa-nav-secondary-links">
                  <li role="search" className="usa-search">
                    <SearchBox />
                  </li>
                  {user.userId && (
                    <li>
                      Hello, {user.name}
                      <button
                        type="button"
                        className="usa-button-secondary sign-out"
                        aria-label="logout"
                        onClick={() => signOutSequence()}
                      >
                        <FontAwesomeIcon icon="sign-out-alt" />
                      </button>{' '}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>
    );
  },
);
