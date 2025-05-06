import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

let dbInstance: Promise<Kysely<Database>> | null = null;
let currentPgPool: Pool | null = null;

export async function getConnection<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T | Promise<T>;
}): Promise<T> {
  const isHealthy = currentPgPool
    ? await isConnectionAlive(currentPgPool)
    : false;

  if (!dbInstance || !isHealthy) {
    dbInstance = establishConnection();
  }

  const awaitedInstance = await dbInstance;
  return await cb(awaitedInstance);
}

async function establishConnection(): Promise<Kysely<Database>> {
  const token = await getToken();

  const poolConfig = {
    ...getPool(),
    password: token,
  };

  const pgPool = new Pool(poolConfig);
  currentPgPool = pgPool;

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool: pgPool }),
    plugins: [new CamelCasePlugin()],
  });
}

async function isConnectionAlive(pool: Pool): Promise<boolean> {
  let client;
  try {
    client = await pool.connect();

    const connected = (client as any)._connected;
    const ending = (client as any)._ending;

    return connected && !ending;
  } catch (err) {
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function generateRDSAuthToken(): Promise<string> {
  const signer = new Signer({
    hostname: environment.rds.pool.host,
    port: 5432,
    region: 'us-east-1', // 10502 TODO: After west is deleted use environment.region
    username: environment.rds.pool.user,
  });

  return signer.getAuthToken();
}

async function getToken(): Promise<string> {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }
  return generateRDSAuthToken();
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
