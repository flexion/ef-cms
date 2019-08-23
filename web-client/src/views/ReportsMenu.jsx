import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export class ReportsMenuComponent extends React.Component {
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
    const { isExpanded, pageIsReports, toggleReportsMenuSequence } = this.props;

    return (
      <div ref={node => (this.node = node)}>
        <button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            pageIsReports && 'usa-current',
          )}
          onClick={() => toggleReportsMenuSequence()}
        >
          <span>Reports</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

ReportsMenuComponent.propTypes = {
  isExpanded: PropTypes.bool,
  pageIsReports: PropTypes.bool,
  resetHeaderAccordionsSequence: PropTypes.func,
  toggleReportsMenuSequence: PropTypes.func,
};

export const ReportsMenu = connect(
  {
    pageIsReports: state.headerHelper.pageIsReports,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleReportsMenuSequence: sequences.toggleReportsMenuSequence,
  },
  ReportsMenuComponent,
);
