export const createAttorneyUserHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const roles = [
    USER_ROLES.practitioner,
    USER_ROLES.respondent,
    USER_ROLES.inactivePractitioner,
    USER_ROLES.inactiveRespondent,
  ];

  return {
    roles,
  };
};
