import { migrateItems as migration0007 } from './migrations/0007-update-corporate-disclosure-document';
import { migrateItems as migration0008 } from './migrations/0008-add-assignee-id-gsi2pk-to-work-item';
import { migrateItems as migration0009 } from './migrations/0009-add-trial-location-field-to-work-item';
import { migrateItems as migration0010 } from './migrations/0010-add-lead-docket-number-to-case-deadline';
import { migrateItems as migration0011 } from './migrations/0011-add-filed-by-role';
import { migrateItems as migration0012 } from './migrations/0012-remove-signed-judge-on-spos-spto';

export const migrationsToRun = [
  {
    key: '0007-update-corporate-disclosure-document.ts',
    script: migration0007,
  },
  {
    key: '0008-add-assignee-id-gsi2pk-to-work-item.ts',
    script: migration0008,
  },
  {
    key: '0009-add-trial-location-field-to-work-item.ts',
    script: migration0009,
  },
  {
    key: '0010-add-lead-docket-number-to-case-deadline.ts',
    script: migration0010,
  },
  {
    key: '0011-add-filed-by-role.ts',
    script: migration0011,
  },
  { key: '0012-remove-signed-judge-on-spos-spto', script: migration0012 },
];
