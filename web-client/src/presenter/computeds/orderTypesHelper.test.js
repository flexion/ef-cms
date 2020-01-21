import { applicationContext } from '../../applicationContext';
import { orderTypesHelper as orderTypesHelperComputed } from './orderTypesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let user = {
  role: 'docketclerk',
};

const orderTypesHelper = withAppContextDecorator(orderTypesHelperComputed, {
  ...applicationContext,
  getConstants: () => {
    return {
      COURT_ISSUED_EVENT_CODES: [
        { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
      ],
      ORDER_TYPES_MAP: [
        { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
      ],
      USER_ROLES: {
        petitionsClerk: 'petitionsclerk',
      },
    };
  },
  getCurrentUser: () => user,
});

describe('orderTypesHelper', () => {
  it('should return all event codes for docketclerk', () => {
    const result = runCompute(orderTypesHelper, {});
    expect(result.orderTypes).toEqual([
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ]);
  });

  it('should filter out and only return type O for petitionsclerk', () => {
    user.role = 'petitionsclerk';
    const result = runCompute(orderTypesHelper, {});
    expect(result.orderTypes).toEqual([
      {
        code: 'Shenzi',
        documentType: 'Hyena',
        eventCode: 'O',
      },
    ]);
  });

  it('should return showDocumentTitleInput true and documentTitleInputLabel if state.form.eventCode is O', () => {
    const result = runCompute(orderTypesHelper, {
      state: { form: { eventCode: 'O' } },
    });
    expect(result.showDocumentTitleInput).toEqual(true);
    expect(result.documentTitleInputLabel).toEqual('Order title');
  });

  it('should return showDocumentTitleInput true and documentTitleInputLabel if state.form.eventCode is NOT', () => {
    const result = runCompute(orderTypesHelper, {
      state: { form: { eventCode: 'NOT' } },
    });
    expect(result.showDocumentTitleInput).toEqual(true);
    expect(result.documentTitleInputLabel).toEqual('Notice title');
  });

  it('should return showDocumentTitleInput false if state.form.eventCode is not O or NOT', () => {
    const result = runCompute(orderTypesHelper, {
      state: { form: { eventCode: 'OTHER' } },
    });
    expect(result.showDocumentTitleInput).toEqual(false);
  });
});
