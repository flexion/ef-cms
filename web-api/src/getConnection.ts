import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

let dbInstance: Promise<Kysely<Database>> | null = null;
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getConnection<T>({
  cb,
  retries = 2,
  backoffMs = 200,
}: {
  cb: (r: Kysely<Database>) => T;
  retries: number;
  backoffMs: number;
}): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      if (!dbInstance) {
        dbInstance = establishConnection();
      }
      const awaitedInstance = await dbInstance;
      return await cb(awaitedInstance);
    } catch (err) {
      if (isConnectionError(err) && attempt < retries) {
        attempt++;
        console.warn(
          `pg connection error (attempt ${attempt} of ${retries}):`,
          err,
        );

        dbInstance = establishConnection();

        await delay(backoffMs * 2 ** (attempt - 1));
        continue;
      }

      throw err;
    }
  }
}

async function establishConnection(): Promise<Kysely<Database>> {
  const token = await getToken();
  return connect({
    ...getPool(),
    password: token,
  });
}

export function connect(pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({ ...pool }),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

async function generateRDSAuthToken() {
  const signer = new Signer({
    hostname: environment.rds.pool.host,
    port: 5432,
    region: 'us-east-1', // 10502 TODO: After west is deleted use environment.region
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

async function getToken() {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }

  return await generateRDSAuthToken();
}

let pool: PoolConfig;

function getPool(): PoolConfig {
  if (!pool) {
    pool = {
      ...environment.rds.pool,
      ssl: environment.rds.useGlobalCert
        ? {
            ca: fs.readFileSync('global-bundle.pem').toString(),
          }
        : undefined,
    };
  }
  return pool;
}

// only retry on errors that will be fixed by reconnection
// error codes not always available, therefore use combination of pg codes, node codes, and message string matching
function isConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;

  const pgCode = (err as any).code;
  const nodeCode = (err as any).errno || (err as any).code;

  const pgCodes = [
    '28P01', // invalid_password (expired token)
    '57P03', // cannot_connect_now
    '53300', // too_many_connections (should never happen)
    '08006', // connection_failure
    '08003', // connection_does_not_exist
    '08001', // sqlclient_unable_to_establish_connection
  ];

  const nodeCodes = [
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EPIPE',
    'EHOSTUNREACH',
    'ENOTFOUND',
  ];

  const errorMessage = err.message?.toLowerCase();

  return (
    (pgCode && pgCodes.includes(pgCode)) ||
    (nodeCode && nodeCodes.includes(nodeCode)) ||
    errorMessage.includes('password authentication failed') ||
    errorMessage.includes('server closed the connection unexpectedly') ||
    errorMessage.includes('terminating connection')
  );
}

// async function isConnectionValid(db: Kysely<Database>): Promise<boolean> {
//   try {
//     await db.executeQuery<{ result: 1 }>(
//       CompiledQuery.raw('select 1 as result', []),
//     );
//     return true;
//   } catch (err) {
//     return false;
//   }
// }
