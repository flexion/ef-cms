import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwMessage').dropColumn('message').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwMessage')
    .addColumn('message', 'varchar')
    .execute();
  await db
    .updateTable('dwMessage')
    .set({
      message: sql`body`,
    })
    .execute();
}
