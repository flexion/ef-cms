import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('trialSession')
    .addColumn('trialSessionId', 'varchar', col => col.primaryKey())
    .addColumn('address1', 'varchar')
    .addColumn('address2', 'varchar')
    .addColumn('alternateTrialClerkName', 'varchar')
    .addColumn('caseOrder', 'jsonb', col => col.notNull())
    .addColumn('chambersPhoneNumber', 'varchar')
    .addColumn('city', 'varchar')
    .addColumn('courthouseName', 'varchar')
    .addColumn('courtReporter', 'varchar')
    .addColumn('createdAt', 'timestamptz')
    .addColumn('dismissedAlertForNOTT', 'boolean')
    .addColumn('hasNOTTBeenServed', 'boolean', col => col.notNull())
    .addColumn('estimatedEndDate', 'timestamptz')
    .addColumn('irsCalendarAdministrator', 'varchar')
    .addColumn('irsCalendarAdministratorInfo', 'jsonb')
    .addColumn('isCalendared', 'boolean', col => col.notNull())
    .addColumn('joinPhoneNumber', 'varchar')
    .addColumn('judge', 'varchar')
    .addColumn('maxCases', 'integer')
    .addColumn('meetingId', 'varchar')
    .addColumn('notes', 'varchar')
    .addColumn('noticeIssuedDate', 'timestamptz')
    .addColumn('password', 'varchar')
    .addColumn('postalCode', 'varchar')
    .addColumn('proceedingType', 'varchar', col => col.notNull())
    .addColumn('sessionScope', 'varchar', col => col.notNull())
    .addColumn('sessionStatus', 'varchar', col => col.notNull())
    .addColumn('sessionType', 'varchar', col => col.notNull())
    .addColumn('startDate', 'timestamptz', col => col.notNull())
    .addColumn('startTime', 'varchar')
    .addColumn('state', 'varchar')
    .addColumn('swingSession', 'boolean')
    .addColumn('swingSessionId', 'varchar')
    .addColumn('term', 'varchar', col => col.notNull())
    .addColumn('termYear', 'varchar', col => col.notNull())
    .addColumn('trialClerk', 'varchar')
    .addColumn('trialLocation', 'varchar')
    .addColumn('paperServicePdfs', 'jsonb', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('trialSession').execute();
}
