import { createUser } from '@web-api/gateways/user/createUser';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { updateUser } from '@web-api/gateways/user/updateUser';

export const getUserGateway = () => ({
  createUser,
  getUserByEmail,
  updateUser,
});
