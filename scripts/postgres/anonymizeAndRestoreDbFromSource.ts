#!/usr/bin/env -S npx ts-node --transpile-only

// This script can copy the contents of one database and overwrite the contents
// of another in a different account. It must be run from the AWS account that
// is creating the backup, and it will assume a role in the target account.

import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { DescribeDBClustersCommand, RDSClient } from '@aws-sdk/client-rds';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { Signer } from '@aws-sdk/rds-signer';
import { spawn } from 'child_process';

const scriptConfig: ScriptConfig = {
  description:
    'restoreDbFromSource - Replaces the target database with a dump of the source database',
  environment: {
    sourceEnv: 'ENV',
    postgresMasterUsername: 'POSTGRES_MASTER_USERNAME',
    postgresMasterPassword: 'POSTGRES_MASTER_PASSWORD',
    // targetAccountId: 'TARGET_ACCOUNT_ID',
    // targetEnv: 'TARGET_ENV',
  },
  requireActiveAwsSession: true,
};

async function main() {
  const { sourceEnv, postgresMasterUsername, postgresMasterPassword } =
    parseArgsAndEnvVars(scriptConfig) as {
      sourceEnv: string;
      postgresMasterUsername: string;
      postgresMasterPassword: string;
    };
  // const targetRoleArn = `arn:aws:iam::${targetAccountId}:role/restore_role_${targetEnv}`;

  // const { targetAccessKeyId, targetSecretAccessKey, targetSessionToken } =
  //   await getTargetAccountCredentials({ targetRoleArn });

  const sourceRdsClient = new RDSClient({ region: 'us-east-1' });
  // const targetRdsClient = new RDSClient({
  //   credentials: {
  //     accessKeyId: targetAccessKeyId,
  //     accountId: targetAccountId,
  //     secretAccessKey: targetSecretAccessKey,
  //     sessionToken: targetSessionToken,
  //   },
  //   region: 'us-east-1',
  // });

  const {
    dbName: sourceDbname,
    host: sourceHost,
    port: sourcePort,
  } = await describeRDSInstance({
    environment: sourceEnv,
    rdsClient: sourceRdsClient,
    useWriter: false,
  });

  // create a copy of source db - using pg_dump + pg_restore via a pipe - no intermediate file
  // run our sql script on the temp db
  // backup and restore from the temp db to the target db

  const tempDbname = await createTempDatabase({
    host: sourceHost,
    port: sourcePort,
    username: postgresMasterUsername,
    password: postgresMasterPassword,
  });

  await cloneDatabase({
    host: sourceHost,
    port: sourcePort,
    masterUsername: postgresMasterUsername,
    masterPassword: postgresMasterPassword,
    sourceDb: sourceDbname,
    tempDb: tempDbname,
  });

  await anonymizeData({
    host: sourceHost,
    username: postgresMasterUsername,
    dbName: tempDbname,
    port: sourcePort,
    password: postgresMasterPassword,
    scriptPath: 'scripts/anonymizeEmails.sql',
  });

  // const {
  //   dbName: targetDbname,
  //   host: targetHost,
  //   port: targetPort,
  //   username: targetUsername,
  // } = await describeRDSInstance({
  //   environment: targetEnv,
  //   rdsClient: targetRdsClient,
  //   useWriter: true,
  // });

  const backUpFileName = 'dawson.dump';
  await createDbBackup({
    backUpFileName,
    dbName: tempDbname,
    host: sourceHost,
    port: sourcePort,
    username: postgresMasterUsername,
    password: postgresMasterPassword,
  });

  await restoreFromBackup({
    backUpFileName,
    dbName: 'postgres',
    host: 'localhost',
    port: 5432,
    // targetAccessKeyId,
    // targetAccountId,
    // targetSecretAccessKey,
    // targetSessionToken,
    username: 'postgres',
  });
}
void main();

async function describeRDSInstance({
  environment,
  rdsClient,
  useWriter = false,
}: {
  rdsClient: RDSClient;
  environment: string;
  useWriter: boolean;
}) {
  const clusterIdentifier = `${environment}-dawson-cluster`;
  const command = new DescribeDBClustersCommand({
    DBClusterIdentifier: clusterIdentifier,
  });
  const describeResponse = await rdsClient.send(command);

  const dbCluster = describeResponse.DBClusters?.[0];

  if (!dbCluster) {
    throw new Error('Source cluster was not defined but expected');
  }

  const host = useWriter ? dbCluster.Endpoint : dbCluster.ReaderEndpoint;
  const port = dbCluster.Port;
  const dbName = dbCluster.DatabaseName;
  const username = `${environment}-dawson`;

  if (!host || !port || !dbName) {
    throw new Error('Source configuration was not found');
  }

  return {
    dbName,
    host,
    port,
    username,
  };
}

async function createTempDatabase({
  host,
  port,
  username,
  password,
}: {
  host: string;
  port: number;
  username: string;
  password: string;
}) {
  const dbName = `temp_clone_${Date.now()}`;
  const sql = `CREATE DATABASE ${dbName};`;

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      'psql',
      [
        `--host=${host}`,
        `--port=${port}`,
        `--username=${username}`,
        `--dbname=postgres`,
        '--command',
        sql,
      ],
      {
        env: { ...process.env, PGPASSWORD: password },
        stdio: 'inherit',
      },
    );

    proc.on('close', code => {
      if (code === 0) {
        console.log(`Temp DB ${dbName} created`);
        resolve();
      } else {
        reject(new Error(`Failed to create temp DB. Exit code ${code}`));
      }
    });
  });
  return dbName;
}

async function cloneDatabase({
  host,
  port,
  masterUsername,
  masterPassword,
  sourceDb,
  tempDb,
}: {
  host: string;
  port: number;
  masterUsername: string;
  masterPassword: string;
  sourceDb: string;
  tempDb: string;
}) {
  return new Promise<void>(resolve => {
    const dump = spawn(
      'pg_dump',
      [
        `--host=${host}`,
        `--port=${port}`,
        `--username=${masterUsername}`,
        `--dbname=${sourceDb}`,
        `--format=c`,
        '--verbose',
        '--no-owner',
        '--no-privileges',
      ],
      { env: { ...process.env, PGPASSWORD: masterPassword }, stdio: 'pipe' },
    );

    const restore = spawn(
      'pg_restore',
      [
        `--host=${host}`,
        `--port=${port}`,
        `--username=${masterUsername}`,
        `--dbname=${tempDb}`,
        `--format=c`,
        '--verbose',
        '--no-owner',
        '--no-privileges',
      ],
      { env: { ...process.env, PGPASSWORD: masterPassword }, stdio: 'pipe' },
    );

    dump.stdout.pipe(restore.stdin);

    dump.stderr.on('data', data => console.error('pg_dump:', data.toString()));
    restore.stderr.on('data', data =>
      console.error('pg_restore:', data.toString()),
    );

    restore.on('close', code => {
      if (code) {
        console.log(
          `DB ${tempDb} may have been restored with errors. Check output for errors. Exit code: ${code}`,
        );
      } else {
        console.log(`Successfully restored DB ${tempDb}`);
      }
      resolve(undefined);
    });
  });
}

async function anonymizeData({
  host,
  username,
  dbName,
  port,
  password,
  scriptPath,
}: {
  host: string;
  username: string;
  dbName: string;
  port: number;
  password: string;
  scriptPath: string;
}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const anonymize = spawn(
      'psql',
      [
        `--host=${host}`,
        `--username=${username}`,
        `--dbname=${dbName}`,
        `--port=${port.toString()}`,
        `--file=${scriptPath}`,
        '--echo-errors',
      ],
      {
        env: {
          ...process.env,
          PGPASSWORD: password,
        },
        stdio: 'pipe',
      },
    );

    anonymize.stdout.on('data', data => {
      console.log(`[psql:stdout] ${data.toString('utf-8')}`);
    });

    anonymize.stderr.on('data', data => {
      console.error(`[psql:stderr] ${data.toString('utf-8')}`);
    });

    anonymize.on('error', err => {
      reject(new Error(`Failed to start psql: ${err.message}`));
    });

    anonymize.on('close', code => {
      if (code === 0) {
        console.log(`Anonymization completed on database ${dbName}`);
        resolve();
      } else {
        reject(new Error(`Anonymization failed. Exit code: ${code}`));
      }
    });
  });
}

async function createDbBackup({
  backUpFileName,
  dbName,
  host,
  port,
  username,
  password,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  backUpFileName: string;
  password: string;
}): Promise<void> {
  await new Promise((resolve, reject) => {
    const result = spawn(
      'pg_dump',
      [
        '--no-privileges',
        '--no-owner',
        `--host=${host}`,
        `--username=${username}`,
        `--port=${port}`,
        `--dbname=${dbName}`,
        `--file=${backUpFileName}`,
        '--verbose',
      ],
      { env: { ...process.env, PGPASSWORD: password }, stdio: 'pipe' },
    );

    result.stdout.on('data', data => {
      console.log(data.toString('utf-8'));
    });

    result.stderr.on('data', data => {
      console.error(data.toString('utf-8'));
    });

    result.on('close', code => {
      if (!code) {
        console.log(`Successfully created DB backup of ${dbName}`);
        resolve(undefined);
      }
      reject(
        new Error(
          `Failed to create DB backup of ${dbName} with exit code: ${code}`,
        ),
      );
    });
  });
}

async function restoreFromBackup({
  backUpFileName,
  dbName,
  host,
  port,
  // targetAccessKeyId,
  // targetAccountId,
  // targetSecretAccessKey,
  // targetSessionToken,
  username,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  backUpFileName: string;
  // targetAccessKeyId: string;
  // targetAccountId: string;
  // targetSecretAccessKey: string;
  // targetSessionToken: string;
}): Promise<void> {
  // const targetSigner = new Signer({
  //   credentials: {
  //     accessKeyId: targetAccessKeyId,
  //     accountId: targetAccountId,
  //     secretAccessKey: targetSecretAccessKey,
  //     sessionToken: targetSessionToken,
  //   },
  //   hostname: host,
  //   port,
  //   region: 'us-east-1',
  //   username,
  // });
  // const targetPassword = await targetSigner.getAuthToken();
  const targetPassword = 'example';

  // pg_restore --clean only drops tables that exist in the source dump, so we drop all target tables before calling pg_restore.
  // We could drop the whole target db or the schema, but then we would have to deal with stricter permissions.
  await dropAllTargetTables({
    dbName,
    host,
    port,
    targetPassword,
    username,
  });

  await new Promise(resolve => {
    const restoreDbResult = spawn(
      'psql',
      [
        `--host=${host}`,
        `--username=${username}`,
        `--dbname=${dbName}`,
        `--port=${port}`,
        `--file=${backUpFileName}`,
        '--echo-errors',
      ],
      {
        env: {
          ...process.env,
          PGPASSWORD: targetPassword,
        },

        stdio: 'pipe',
      },
    );

    restoreDbResult.stdout.on('data', data => {
      console.log(data.toString('utf-8'));
    });

    restoreDbResult.stderr.on('data', data => {
      console.error(data.toString('utf-8'));
    });

    restoreDbResult.on('close', code => {
      if (code) {
        console.log(
          `DB ${dbName} may have been restored with errors. Check output for errors. Exit code: ${code}`,
        );
      } else {
        console.log(`Successfully restored DB ${dbName}`);
      }
      resolve(undefined);
    });
  });
}

async function getTargetAccountCredentials({
  targetRoleArn,
}: {
  targetRoleArn: string;
}) {
  const stsClient = new STSClient({ region: 'us-east-1' });
  const command = new AssumeRoleCommand({
    RoleArn: targetRoleArn,
    RoleSessionName: 'DB_Restore_Session',
  });
  const data = await stsClient.send(command);

  const targetAccessKeyId = data.Credentials?.AccessKeyId;
  const targetSecretAccessKey = data.Credentials?.SecretAccessKey;
  const targetSessionToken = data.Credentials?.SessionToken;

  if (!targetAccessKeyId || !targetSecretAccessKey || !targetSessionToken) {
    throw new Error('Could not get credentials of target role');
  }

  return {
    targetAccessKeyId,
    targetSecretAccessKey,
    targetSessionToken,
  };
}

async function dropAllTargetTables({
  dbName,
  host,
  port,
  targetPassword,
  username,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  targetPassword: string;
}): Promise<void> {
  await new Promise(resolve => {
    // For each table in the target db public schema, we will create a SQL DROP command and then execute it.
    const dropTableQuery = spawn(
      'psql',
      [
        `--host=${host}`,
        `--username=${username}`,
        `--dbname=${dbName}`,
        `--port=${port}`,
        '--no-password',
        `--command=DO $$ DECLARE
          stmt text;
        BEGIN
          FOR stmt IN
            SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;'
            FROM pg_tables
            WHERE schemaname = 'public'
          LOOP
            EXECUTE stmt;
          END LOOP;
        END
        $$;`,
      ],
      {
        env: {
          ...process.env,
          PGPASSWORD: targetPassword,
        },
      },
    );

    dropTableQuery.stdout.on('data', data => {
      console.log(data.toString('utf-8'));
    });

    dropTableQuery.stderr.on('data', data => {
      console.error(data.toString('utf-8'));
    });

    dropTableQuery.on('close', code => {
      if (code) {
        console.log(
          `Attempted to drop all tables from DB ${dbName}. Check output for errors. Exit code: ${code}`,
        );
      } else {
        console.log(`Successfully dropped all tables from DB ${dbName}.`);
      }
      resolve(undefined);
    });
  });
}
