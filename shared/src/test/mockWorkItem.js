import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../business/entities/EntityConstants';

export const MOCK_WORK_ITEM = {
  assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
  assigneeName: 'bob',
  caseStatus: CASE_STATUS_TYPES.new,
  caseTitle: 'Johnny Joe Jacobson',
  docketEntry: {},
  docketNumber: '101-18',
  docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
  section: DOCKET_SECTION,
  sentBy: 'bob',
};
