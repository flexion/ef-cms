import { connect } from '@cerebral/react';
import React from 'react';
import { sequences, state } from 'cerebral';

export default connect(
  {
    styles: state.styles,
    updateStyleSequence: sequences.updateStyleSequence,
  },
  function SearchBox({ styles, updateStyleSequence }) {
    return (
      <div id="styles-form">
        <b>Styles</b>
        <p>Values: try &apos;auto&apos; or leave blank to inherit.</p>
        <div>
          <label htmlFor="maxwidth">Max-width</label>
          <input
            id="maxwidth"
            type="text"
            name="maxwidth"
            defaultValue={styles.maxwidth}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <select
            name="maxwidth-units"
            defaultValue={styles['maxwidth-units']}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option>px</option>
            <option>rem</option>
            <option>%</option>
          </select>
        </div>
        <div>
          <label htmlFor="padding">Padding</label>
          <input
            id="padding"
            type="text"
            name="padding"
            defaultValue={styles.padding}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <select
            name="padding-units"
            defaultValue={styles['padding-units']}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option>px</option>
            <option>rem</option>
            <option>%</option>
          </select>
        </div>
        <div>
          <label htmlFor="margin">Margin</label>
          <input
            id="margin"
            type="text"
            name="margin"
            defaultValue={styles.margin}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <select
            name="margin-units"
            defaultValue={styles['margin-units']}
            onChange={e => {
              updateStyleSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option>px</option>
            <option>rem</option>
            <option>%</option>
          </select>
        </div>
      </div>
    );
  },
);
