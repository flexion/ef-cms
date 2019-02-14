import jwt from 'jsonwebtoken';
import { state } from 'cerebral';

import { userMap } from '../../../../shared/src/persistence/getUserById';

export default async ({ get }) => {
  const name = get(state.form.name);
  const user = userMap[name];
  return {
    token: jwt.sign(user, 'secret'),
  };
};
