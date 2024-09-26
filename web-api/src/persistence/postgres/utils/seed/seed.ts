import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';
import { work_items } from './fixtures/work_items';

function camelToSnake(camelStr) {
  return camelStr.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export const seed = async () => {
  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  await getDbWriter(writer =>
    writer
      .insertInto('work_item')
      .values(work_items)
      .onConflict(oc => oc.column('work_item_id').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );
};

seed().catch;
