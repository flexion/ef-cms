'use client';

import { useEffect, useState } from 'react';
import { PublicApp, setupCerebral } from '../../../../web-client/src/appPublic';
import { applicationContextPublic } from '../../../../web-client/src/applicationContextPublic';

export function DawsonPublicApp() {
  const [cerebral, setCerebral] = useState<any>();

  useEffect(() => {
    const cerebralApp = setupCerebral(applicationContextPublic);
    setCerebral(cerebralApp);
  }, []);

  return <PublicApp cerebralApp={cerebral} />;
}
