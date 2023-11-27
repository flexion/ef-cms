export let token: string;
export const getCurrentUserToken = () => {
  return token;
};
export const setCurrentUserToken = newToken => {
  token = newToken;
};
