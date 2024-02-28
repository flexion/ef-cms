export const pdfGenerationHandler = async event => {
  return (await import('./pdf-generation')).handler(event);
};

export const changeOfAddressHandler = async event => {
  return (await import('./pdf-generation')).changeOfAddressHandler(event);
};

export const setHealthCheckCacheHandler = async event => {
  return (await import('./cron')).setHealthCheckCacheHandler(event);
};

export const checkForReadyForTrialCasesHandler = async event => {
  return (await import('./cron')).checkForReadyForTrialCasesHandler(event);
};

export const cognitoTriggersHandler = async event => {
  return (await import('./cognito-triggers')).handler(event);
};

export const maintenanceNotifyHandler = async event => {
  return (await import('./maintenance-notify')).handler(event);
};

export const publicApiAuthorizerHandler = async event => {
  return (await import('./public-api-authorizer')).handler(event);
};

export const publicApiHandler = async (event, context, callback) => {
  return (await import('./api-public')).handler(event, context, callback);
};

export const sealInLowerEnvironmentHandler = async event => {
  return (await import('./seal-in-lower-environment')).handler(event);
};

export const streamsHandler = async event => {
  return (await import('./streams')).handler(event);
};

export const websocketAuthorizerHandler = async (event, context) => {
  return (await import('./websocket-authorizer')).handler(event, context);
};

export const websocketDefaultHandler = async event => {
  return (await import('./websockets')).defaultHandler(event);
};

export const websocketConnectHandler = async event => {
  return (await import('./websockets')).connectHandler(event);
};

export const websocketDisconnectHandler = async event => {
  return (await import('./websockets')).disconnectHandler(event);
};

export const postAuthenticationHandler = async event => {
  return (await import('./cognito-triggers')).handler(event);
};

export const updatePetitionerCasesHandler = async event => {
  return (await import('./cognito-triggers')).updatePetitionerCasesLambda(
    event,
  );
};

export const cognitoAuthorizerHandler = async (event, context) => {
  return (await import('./cognito-authorizer')).handler(event, context);
};

export const apiHandler = async (event, context) => {
  return (await import('./api')).handler(event, context);
};
