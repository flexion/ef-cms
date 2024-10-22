import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwMessage').addColumn('body', 'text').execute();
  await db
    .updateTable('dwMessage')
    .set({
      body: sql`message`,
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwMessage').dropColumn('body').execute();
}
