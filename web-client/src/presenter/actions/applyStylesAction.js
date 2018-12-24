import { state } from 'cerebral';

export default ({ get }) => {
  const app = document.querySelector('#app');
  const properties = ['maxwidth', 'margin', 'padding'];
  const styles = get(state.styles);
  properties.forEach(property => {
    const key = `--experiment-${property}`;
    const units = isNaN(styles[property]) ? '' : styles[`${property}-units`];
    const value =
      styles[property].length === 0 ? 'inherit' : `${styles[property]}${units}`;
    app.style.setProperty(key, value);
  });
};
