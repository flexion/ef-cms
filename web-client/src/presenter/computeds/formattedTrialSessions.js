import { filter, find, identity, omit, orderBy, pickBy } from 'lodash';
import { state } from 'cerebral';

export const formatSession = (session, applicationContext) => {
  session.startOfWeek = applicationContext
    .getUtilities()
    .prepareDateFromString(session.startDate)
    .startOf('isoWeek')
    .format('MMMM D, YYYY');
  session.startOfWeekSortable = applicationContext
    .getUtilities()
    .prepareDateFromString(session.startDate)
    .startOf('isoWeek')
    .format('YYYYMMDD');
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  session.formattedNoticeIssuedDate = applicationContext
    .getUtilities()
    .formatDateString(session.noticeIssuedDate, 'MMDDYYYY');
  return session;
};

export const sessionSorter = (sessionList, dateSort = 'asc') => {
  return orderBy(
    sessionList,
    ['startDate', 'trialLocation'],
    [dateSort, 'asc'],
  );
};

export const filterFormattedSessionsByStatus = (
  trialTerms,
  applicationContext,
) => {
  const { getTrialSessionStatus } = applicationContext.getUtilities();

  const sessionSort = {
    All: 'desc',
    Closed: 'desc',
    New: 'asc',
    Open: 'asc',
  };

  const filteredbyStatusType = {
    All: [],
    Closed: [],
    New: [],
    Open: [],
  };

  const initTermIndex = (trialTerm, filtered) => {
    let termIndex = filtered.findIndex(
      term => term.dateFormatted === trialTerm.dateFormatted,
    );

    if (termIndex === -1) {
      filtered.push({
        dateFormatted: trialTerm.dateFormatted,
        sessions: [],
        startOfWeekSortable: trialTerm.startOfWeekSortable,
      });
      termIndex = filtered.length - 1;
    }

    return termIndex;
  };

  trialTerms.forEach(trialTerm => {
    trialTerm.sessions.forEach(session => {
      const status = getTrialSessionStatus({ applicationContext, session });
      const termIndex = initTermIndex(trialTerm, filteredbyStatusType[status]);

      if (!session.judge) {
        session.judge = {
          name: 'Unassigned',
          userId: 'unassigned',
        };
      }
      // Add session status to filtered session
      session.sessionStatus = status;
      filteredbyStatusType[status][termIndex].sessions.push(session);

      // Push to all
      const allTermIndex = initTermIndex(trialTerm, filteredbyStatusType.All);
      filteredbyStatusType.All[allTermIndex].sessions.push(session);
    });
  });

  for (let [status, entryTrialTerms] of Object.entries(filteredbyStatusType)) {
    filteredbyStatusType[status] = orderBy(
      entryTrialTerms,
      ['startOfWeekSortable'],
      [sessionSort[status]],
    );
    entryTrialTerms.forEach(trialTerm => {
      trialTerm.sessions = sessionSorter(trialTerm.sessions, [
        sessionSort[status],
      ]);
    });
  }

  return filteredbyStatusType;
};

export const formattedTrialSessions = (get, applicationContext) => {
  const judgeId = get(state.judgeUser.userId);

  // filter trial sessions
  const trialSessionFilters = pickBy(
    omit(get(state.screenMetadata.trialSessionFilters), 'status'),
    identity,
  );
  const judgeFilter = get(
    state.screenMetadata.trialSessionFilters.judge.userId,
  );

  const tab = get(state.trialSessionsTab.group);

  if (!judgeFilter || (tab !== 'new' && judgeFilter === 'unassigned')) {
    delete trialSessionFilters.judge;
  }

  const sessions = filter(get(state.trialSessions), trialSessionFilters);

  const formattedSessions = [];
  sessions.forEach(session => {
    session.userIsAssignedToSession = session.judge?.userId === judgeId;

    const formattedSession = formatSession(session, applicationContext);

    let sessionWeek = find(formattedSessions, {
      startOfWeekSortable: formattedSession.startOfWeekSortable,
    });

    if (!sessionWeek) {
      sessionWeek = {
        dateFormatted: formattedSession.startOfWeek,
        sessions: [],
        startOfWeekSortable: formattedSession.startOfWeekSortable,
      };
      formattedSessions.push(sessionWeek);
    }
    sessionWeek.sessions.push(session);
  });

  formattedSessions.forEach(
    week => (week.sessions = sessionSorter(week.sessions)),
  );

  const selectedTerm = get(state.form.term);
  let sessionsByTerm = [];
  if (selectedTerm) {
    const selectedTermYear = get(state.form.termYear);
    sessionsByTerm = orderBy(
      sessions.filter(
        session =>
          session.term === selectedTerm && session.termYear == selectedTermYear,
      ),
      'trialLocation',
    );
  }

  return {
    filteredTrialSessions: filterFormattedSessionsByStatus(
      formattedSessions,
      applicationContext,
    ),
    formattedSessions,
    sessionsByTerm,
    showSwingSessionList: get(state.form.swingSession),
    showSwingSessionOption: sessionsByTerm.length > 0,
  };
};
