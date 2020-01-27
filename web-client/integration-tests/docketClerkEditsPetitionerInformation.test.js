import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('docket clerk edits the petitioner information', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;

  it('login as a tax payer and create a case', async () => {
    await loginAs(test, 'petitioner');
    caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        serviceIndicator: 'Paper',
        state: 'CT',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    test.docketNumber = caseDetail.docketNumber;
  });

  it('login as the docketclerk and edit the case contact information', async () => {
    await loginAs(test, 'docketclerk');

    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '734 Cowley Parkway',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '',
    });

    expect(test.getState('form.contactPrimary.address1')).toEqual('');

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('validationErrors')).toEqual({
      contactPrimary: { address1: 'Enter mailing address' },
      contactSecondary: null,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Some Street',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.serviceIndicator',
      value: 'Paper',
    });
  });

  it('verify that the paper service modal is displayed after submitting the address, the address was updated, and a Notice of Change of Address was generated and served', async () => {
    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('showModal')).toEqual('PaperServiceConfirmModal');

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '123 Some Street',
    );

    const noticeDocument = test.getState('caseDetail.documents.2');
    expect(noticeDocument.documentType).toEqual('Notice of Change of Address');
    expect(noticeDocument.servedAt).toBeDefined();
  });
});
