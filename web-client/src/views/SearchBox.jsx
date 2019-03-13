import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchBox = connect(
  {
    searchTerm: state.searchTerm,
    submitSearchSequence: sequences.submitSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  ({ searchTerm, submitSearchSequence, updateSearchTermSequence }) => {
    return (
      <form
        className="usa-search"
        id="search-input"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          submitSearchSequence();
        }}
      >
        <label className="usa-sr-only" htmlFor="search-field">
          Search term
        </label>
        <input
          id="search-field"
          type="search"
          name="searchTerm"
          value={searchTerm}
          onChange={e => {
            updateSearchTermSequence({
              searchTerm: e.target.value,
            });
          }}
        />
        <button type="submit">
          <span className="usa-search-submit-text">Search</span>
        </button>
      </form>
    );
  },
);
