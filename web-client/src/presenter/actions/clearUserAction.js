import { state } from 'cerebral';

export default ({ store, applicationContext }) => {
  store.set(state.user, null);
  store.set(state.token, null);
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('token');
  applicationContext.setCurrentUser(null);
};
