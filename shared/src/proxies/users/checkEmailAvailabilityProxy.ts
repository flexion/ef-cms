import { get } from '../requests';

export const checkEmailAvailabilityInteractor = (
  applicationContext,
  { email },
): Promise<boolean> => {
  return get({
    applicationContext,
    endpoint: '/users/email-availability',
    params: {
      email,
    },
  });
};
