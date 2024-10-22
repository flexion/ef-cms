import * as path from 'path';
import { FileMigrationProvider, Migrator } from 'kysely';
import { promises as fs } from 'fs';
import { getDbWriter } from '../../../../database';

async function migrateToLatest(migrationType: string) {
  if (migrationType !== 'expand' && migrationType !== 'contract') {
    throw new Error(`Unable to run unknown migration type: ${migrationType}`);
  }

  await getDbWriter(async writer => {
    const migrator = new Migrator({
      db: writer,
      provider: new FileMigrationProvider({
        fs,
        migrationFolder: path.join(__dirname, 'migrations'),
        path,
      }),
    });

    const migrations = await migrator.getMigrations();

    for (const migration of migrations) {
      if (migration.name.includes(`.${migrationType}`)) {
        const { error, results } = await migrator.migrateTo(migration.name);
        results?.forEach(it => {
          if (it.status === 'Success') {
            console.log(
              `migration "${it.migrationName}" was executed successfully`,
            );
          } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
          }
        });

        if (error) {
          console.error('failed to migrate');
          console.error(error);
          process.exit(1);
        }
      }
    }

    await writer.destroy();
  });
}

migrateToLatest(process.argv[2]).catch;

// eslint-disable-next-line spellcheck/spell-checker
/*
DB Now
0001-init
0002-init-indexes


In Repo
0001-init
0002-init-indexes
0003-add-message-body.expand.ts
0003-remove-message-message.contract.ts

*/
