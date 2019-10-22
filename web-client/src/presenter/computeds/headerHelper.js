import { state } from 'cerebral';

export const headerHelper = (get, applicationContext) => {
  const user = get(state.user);
  const isLoggedIn = !!user;
  const userRole = get(state.user.role);
  const currentPage = get(state.currentPage) || '';
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueToDisplay.workQueueIsInternal);
  const USER_ROLES = get(state.constants.USER_ROLES);

  const isOtherUser = role => {
    const externalRoles = [USER_ROLES.petitionsClerk, USER_ROLES.docketClerk];
    return !externalRoles.includes(role);
  };

  const isTrialSessions = currentPage.includes('TrialSession');
  const isDashboard = currentPage.startsWith('Dashboard');
  const isMessages = currentPage.startsWith('Messages');

  const pageIsInterstitial = currentPage == 'Interstitial';
  const pageIsHome =
    isDashboard ||
    ([
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.seniorAttorney,
    ].includes(userRole) &&
      isMessages);
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');
  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC: isMessages && !workQueueIsInternal,
    pageIsHome,
    pageIsInterstitial,
    pageIsMessages: isMessages && workQueueIsInternal,
    pageIsMyCases:
      isDashboard && applicationContext.getUtilities().isExternalUser(userRole),
    pageIsReports: isCaseDeadlines || isBlockedCasesReport,
    pageIsTrialSessions:
      isTrialSessions &&
      applicationContext.getUtilities().isInternalUser(userRole),
    showAccountMenu: isLoggedIn,
    showDocumentQC: applicationContext.getUtilities().isInternalUser(userRole),
    showHomeIcon: userRole === USER_ROLES.judge,
    showMessages: applicationContext.getUtilities().isInternalUser(userRole),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases: applicationContext.getUtilities().isExternalUser(userRole),
    showReports: applicationContext.getUtilities().isInternalUser(userRole),
    showSearchInHeader:
      user &&
      userRole &&
      userRole !== USER_ROLES.practitioner &&
      userRole !== USER_ROLES.respondent,
    showTrialSessions: applicationContext
      .getUtilities()
      .isInternalUser(userRole),
  };
};
