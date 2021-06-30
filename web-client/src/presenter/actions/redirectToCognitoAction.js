import { state } from 'cerebral';

export const redirectToCognitoAction = async ({ get, router }) => {
  console.log('redirectToCognitoAction', redirectToCognitoAction);
  router.externalRoute(get(state.cognitoLoginUrl));
};
