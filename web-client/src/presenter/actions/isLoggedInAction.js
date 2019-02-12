import { state } from 'cerebral';

export default ({ get, path, router }) => {
  const user = get(state.user);
  if (!user || !user.userId || !user.role) {
    return path['unauthorized']({ path: router.route() });
  } else {
    return path['isLoggedIn']();
  }
};
