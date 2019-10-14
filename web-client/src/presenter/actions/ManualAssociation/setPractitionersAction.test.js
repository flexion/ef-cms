import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setPractitionersAction } from './setPractitionersAction';

presenter.providers.applicationContext = applicationContext;

describe('setPractitionersAction', () => {
  it('sets state.modal.practitionerMatches to the passed in props.practitioners and defaults state.modal.user to that user if there is only one match', async () => {
    const result = await runAction(setPractitionersAction, {
      props: { practitioners: [{ name: 'Test Practitioner', userId: '123' }] },
      state: {
        caseDetail: {
          practitioners: [],
        },
        modal: {},
      },
    });
    expect(result.state.modal.practitionerMatches).toEqual([
      { name: 'Test Practitioner', userId: '123' },
    ]);
    expect(result.state.modal.user).toEqual({
      name: 'Test Practitioner',
      userId: '123',
    });
  });

  it('sets state.modal.practitionerMatches to the passed in props.practitioners and does not default state.modal.user if there is more than one match', async () => {
    const result = await runAction(setPractitionersAction, {
      props: {
        practitioners: [
          { name: 'Test Practitioner', userId: '123' },
          { name: 'Test Practitioner2', userId: '234' },
        ],
      },
      state: {
        caseDetail: {
          practitioners: [],
        },
        modal: {},
      },
    });
    expect(result.state.modal.practitionerMatches).toEqual([
      { name: 'Test Practitioner', userId: '123' },
      { name: 'Test Practitioner2', userId: '234' },
    ]);
    expect(result.state.modal.user).toBeUndefined();
  });
});
