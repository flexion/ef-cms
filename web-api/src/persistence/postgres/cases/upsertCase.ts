import { getDbWriter } from '@web-api/database';

export const upsertCase = async ({ rawCase }: { rawCase: RawCase }) => {
  const caseToUpsert = {
    caption: rawCase.caseCaption,
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    leadDocketNumber: rawCase.leadDocketNumber,
    status: rawCase.status,
    trialDate: rawCase.trialDate,
    trialLocation: rawCase.trialLocation,
  };
  await getDbWriter(writer =>
    writer
      .insertInto('case')
      .values(caseToUpsert)
      .onConflict(oc => oc.column('docketNumber').doUpdateSet(caseToUpsert))
      .execute(),
  );
};
