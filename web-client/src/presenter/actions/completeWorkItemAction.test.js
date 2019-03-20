import { runAction } from 'cerebral/test';

import { presenter } from '../presenter';

import { completeWorkItemAction } from './completeWorkItemAction';

import sinon from 'sinon';

const completeWorkItemStub = sinon.stub().returns(null);

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    name: 'Docket Clerk',
    userId: 'docketclerk',
  }),
  getUseCases: () => ({
    completeWorkItem: completeWorkItemStub,
  }),
};

presenter.providers.path = {
  error() {},
  success() {},
};

describe('completeWorkItem', () => {
  it('should have undefined completedMessage if completeForm is empty', async () => {
    await runAction(completeWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        workItemId: 'abc',
      },
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  messages: [],
                  workItemId: 'abc',
                },
              ],
            },
          ],
        },
        completeForm: {},
        user: {
          name: 'Docket Clerk',
          token: 'docketclerk',
          userId: 'docketclerk',
        },
      },
    });
    expect(
      completeWorkItemStub.getCall(0).args[0].completedMessage,
    ).toBeUndefined();
  });

  it('should set completedMessage to completeMessage in completeForm', async () => {
    await runAction(completeWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        workItemId: 'abc',
      },
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  messages: [],
                  workItemId: 'abc',
                },
              ],
            },
          ],
        },
        completeForm: { abc: { completeMessage: 'Completed' } },
        user: {
          name: 'Docket Clerk',
          token: 'docketclerk',
          userId: 'docketclerk',
        },
      },
    });
    expect(completeWorkItemStub.getCall(1).args[0].completedMessage).toEqual(
      'Completed',
    );
  });
});
