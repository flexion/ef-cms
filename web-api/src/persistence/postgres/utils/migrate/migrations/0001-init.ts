import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('case')
    .addColumn('docketNumber', 'varchar', col => col.primaryKey())
    .addColumn('trialLocation', 'varchar')
    .addColumn('leadDocketNumber', 'varchar')
    .addColumn('trialDate', 'varchar')
    .addColumn('docketNumberSuffix', 'varchar')
    .execute();

  await db.schema
    .createTable('message')
    .addColumn('messageId', 'varchar', col => col.primaryKey())
    .addColumn('attachments', 'jsonb')
    .addColumn('caseStatus', 'varchar', col => col.notNull())
    .addColumn('caseTitle', 'varchar', col => col.notNull())
    .addColumn('completedAt', 'varchar')
    .addColumn('completedBy', 'varchar')
    .addColumn('completedBySection', 'varchar')
    .addColumn('completedByUserId', 'varchar')
    .addColumn('completedMessage', 'varchar')
    .addColumn('createdAt', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('from', 'varchar')
    .addColumn('fromSection', 'varchar')
    .addColumn('fromUserId', 'varchar')
    .addColumn('isCompleted', 'boolean')
    .addColumn('isRead', 'boolean')
    .addColumn('isRepliedTo', 'boolean')
    .addColumn('message', 'varchar', col => col.notNull())
    .addColumn('parentMessageId', 'varchar', col => col.notNull())
    .addColumn('subject', 'varchar', col => col.notNull())
    .addColumn('to', 'varchar', col => col.notNull())
    .addColumn('toSection', 'varchar', col => col.notNull())
    .addColumn('toUserId', 'varchar', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('message').execute();
  await db.schema.dropTable('case').execute();
}