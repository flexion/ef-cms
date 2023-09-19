import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultGenerationTypeAction } from './setDefaultGenerationTypeAction';

describe('setDefaultGenerationTypeAction', () => {
  presenter.providers.applicationContext = applicationContext;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);
  });

  it('should set the generation type to auto and set consolidated filing state values to false when the changed event code is EA', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'EA',
      },
      state: {
        caseDetail: {
          leadDocketNumber: undefined,
        },
        form: {
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
    expect(state.form.fileAcrossConsolidatedGroup).toEqual(false);
    expect(state.allowExternalConsolidatedGroupFiling).toEqual(false);
  });

  it('should set the generation type to manual and leave consolidated filing state values untouched when the changed event code is NOT EA and the user is NOT an IRS Practitioner', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        allowExternalConsolidatedGroupFiling: false,
        caseDetail: {
          leadDocketNumber: undefined,
        },
        form: {
          fileAcrossConsolidatedGroup: false,
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
    expect(state.form.fileAcrossConsolidatedGroup).toEqual(false);
    expect(state.allowExternalConsolidatedGroupFiling).toEqual(false);
  });

  it('should set the generation type to manual and set consolidated filing state values to true when the changed event code is NOT EA and the user is an IRS Practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce(irsPractitionerUser);

    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'eventCode',
        value: 'SOC',
      },
      state: {
        allowExternalConsolidatedGroupFiling: false,
        caseDetail: {
          leadDocketNumber: '101-20',
        },
        form: {
          fileAcrossConsolidatedGroup: false,
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
    expect(state.form.fileAcrossConsolidatedGroup).toEqual(true);
    expect(state.allowExternalConsolidatedGroupFiling).toEqual(true);
  });

  it('should not modify the existing generation type for non eventCode/generationType props', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'documentType',
        value: 'Substitution of Counsel',
      },
      state: {
        caseDetail: {
          leadDocketNumber: undefined,
        },
        form: {
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.AUTO);
  });

  it('should reset consolidated filing state values to true when generationType = manual is passed as props and user is an irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce(irsPractitionerUser);
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'generationType',
        value: 'manual',
      },
      state: {
        allowExternalConsolidatedGroupFiling: false,
        caseDetail: {
          leadDocketNumber: '101-20',
        },
        form: {
          fileAcrossConsolidatedGroup: false,
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
    expect(state.allowExternalConsolidatedGroupFiling).toEqual(true);
    expect(state.form.fileAcrossConsolidatedGroup).toEqual(true);
  });

  it('should not modify consolidated filing state values to true when generationType = manual is passed as props but user is NOT an irsPractitioner', async () => {
    const { state } = await runAction(setDefaultGenerationTypeAction, {
      modules: { presenter },
      props: {
        key: 'generationType',
        value: 'manual',
      },
      state: {
        allowExternalConsolidatedGroupFiling: false,
        caseDetail: {
          leadDocketNumber: undefined,
        },
        form: {
          fileAcrossConsolidatedGroup: false,
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(state.form.generationType).toEqual(GENERATION_TYPES.MANUAL);
    expect(state.allowExternalConsolidatedGroupFiling).toEqual(false);
    expect(state.form.fileAcrossConsolidatedGroup).toEqual(false);
  });
});
