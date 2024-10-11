import { caseDeadlines } from '@web-api/persistence/postgres/utils/seed/fixtures/caseDeadlines';
import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  const insertMessages = getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );
  const insertCaseDeadline = getDbWriter(writer =>
    writer
      .insertInto('dwCaseDeadline')
      .values(caseDeadlines)
      .onConflict(oc => oc.column('caseDeadlineId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  await Promise.all([insertMessages, insertCaseDeadline]);
};

seed().catch;
