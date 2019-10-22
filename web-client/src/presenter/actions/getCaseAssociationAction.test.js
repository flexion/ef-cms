import { User } from '../../../../shared/src/business/entities/User';
import { getCaseAssociationAction } from './getCaseAssociationAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('getCaseAssociation', () => {
  it('should return that practitioner is associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          role: User.ROLES.practitioner,
          userId: '123',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that practitioner has pending association', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(true);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          role: User.ROLES.practitioner,
          userId: '1234',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: true,
    });
  });

  it('should return that practitioner not associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          role: User.ROLES.practitioner,
          userId: '1234',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          respondents: [{ userId: '789' }],
        },
        user: {
          role: User.ROLES.respondent,
          userId: '789',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is not associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(true);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          respondent: { userId: '123' },
        },
        user: {
          role: User.ROLES.respondent,
          userId: '789',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          userId: '123',
        },
        user: {
          role: User.ROLES.petitioner,
          userId: '123',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is not associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(true);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUserInteractor: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          userId: '123',
        },
        user: {
          role: User.ROLES.petitioner,
          userId: '789',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });
});
