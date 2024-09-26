import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('work_item')
    .addColumn('work_item_id', 'varchar', col => col.primaryKey())
    .addColumn('assignee_id', 'varchar')
    .addColumn('assignee_name', 'varchar')
    .addColumn('associated_judge', 'varchar', col => col.notNull())
    .addColumn('associated_judge_id', 'varchar')
    .addColumn('case_is_in_progress', 'boolean')
    .addColumn('case_status', 'varchar', col => col.notNull())
    .addColumn('case_title', 'varchar')
    .addColumn('completed_at', 'varchar')
    .addColumn('completed_by', 'varchar')
    .addColumn('completed_by_user_id', 'varchar')
    .addColumn('completed_message', 'varchar')
    .addColumn('created_at', 'varchar', col => col.notNull())
    .addColumn('docket_entry', 'jsonb', col => col.notNull())
    .addColumn('docket_number', 'varchar', col => col.notNull())
    .addColumn('docket_number_with_suffix', 'varchar')
    .addColumn('hide_from_pending_messages', 'boolean')
    .addColumn('high_priority', 'boolean')
    .addColumn('in_progress', 'boolean')
    .addColumn('is_initialize_case', 'boolean')
    .addColumn('is_read', 'boolean')
    .addColumn('lead_docket_number', 'varchar')
    .addColumn('section', 'varchar', col => col.notNull())
    .addColumn('sent_by', 'varchar', col => col.notNull())
    .addColumn('sent_by_section', 'varchar')
    .addColumn('sent_by_user_id', 'varchar')
    .addColumn('trial_date', 'varchar')
    .addColumn('trial_location', 'varchar')
    .addColumn('updated_at', 'varchar', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workItem').execute();
}
