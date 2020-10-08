import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getJudgesCaseNoteForCaseAction } from '../actions/TrialSession/getJudgesCaseNoteForCaseAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { parallel, set } from 'cerebral/factories';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCaseDetailPageTabUnfrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabUnfrozenAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setDefaultCorrespondenceDocumentIdAction } from '../actions/setDefaultCorrespondenceDocumentIdAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { showModalFromQueryAction } from '../actions/showModalFromQueryAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoCaseDetailInternal = [
  getTrialSessionsAction,
  setTrialSessionsAction,
  setTrialSessionJudgeAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  setDefaultCorrespondenceDocumentIdAction,
  setDocketEntryIdAction,
  showModalFromQueryAction,
  getCaseDeadlinesForCaseAction,
  getMessagesForCaseAction,
  setCurrentPageAction('CaseDetailInternal'),
];

const gotoCaseDetailExternal = [
  getCaseAssociationAction,
  setCaseAssociationAction,
  setCurrentPageAction('CaseDetail'),
];

const gotoCaseDetailInternalWithNotes = [
  setDocketEntryIdAction,
  getJudgesCaseNoteForCaseAction,
  setJudgesCaseNoteOnCaseDetailAction,
  gotoCaseDetailInternal,
];

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  setDefaultCaseDetailTabAction,
  setIsPrimaryTabAction,
  getCaseAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  setDefaultDocketRecordSortAction,
  set(state.editDocumentEntryPoint, 'CaseDetail'),
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.floater,
        USER_ROLES.petitionsClerk,
        USER_ROLES.trialClerk,
        USER_ROLES.chambers,
      ],
      [parallel([gotoCaseDetailInternal, fetchUserNotificationsSequence])],
    ),
    ...takePathForRoles(
      [
        USER_ROLES.petitioner,
        USER_ROLES.privatePractitioner,
        USER_ROLES.irsPractitioner,
        USER_ROLES.irsSuperuser,
      ],
      gotoCaseDetailExternal,
    ),
    chambers: gotoCaseDetailInternalWithNotes,
    judge: gotoCaseDetailInternalWithNotes,
  },
  setCaseDetailPageTabUnfrozenAction,
];
