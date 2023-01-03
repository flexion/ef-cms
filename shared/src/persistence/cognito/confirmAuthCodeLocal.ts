import { userMap } from '../../test/mockUserTokenMap.js';
import jwt from 'jsonwebtoken';

export const confirmAuthCodeLocal = (applicationContext, { code }) => {
  const email = code.toLowerCase();
  if (userMap[email]) {
    const user = {
      ...userMap[email],
      sub: userMap[email].userId,
    };
    const token = jwt.sign(user, 'secret');
    return {
      refreshToken: token,
      token,
    };
  } else {
    return {
      alertError: {
        message: 'Login credentials not found.',
        title: 'Login error!',
      },
    };
  }
};
