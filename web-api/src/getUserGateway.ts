import { createUser } from '@web-api/gateways/user/createUser';
import { disableUser } from '@web-api/gateways/user/disableUser';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { isEmailAvailable } from '@web-api/gateways/user/isEmailAvailable';
import { updateUser } from '@web-api/gateways/user/updateUser';

export const getUserGateway = () => ({
  createUser,
  disableUser,
  getUserByEmail,
  isEmailAvailable,
  updateUser,
});
