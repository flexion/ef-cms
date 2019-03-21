import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/contacts/PetitionContact';

import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';
import { updatePartyTypeAction } from './updatePartyTypeAction';

const updateCaseStub = sinon.stub().returns({});

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
  }),
};

const getFixtures = (props, state = {}) => ({
  modules: {
    presenter,
  },
  props,
  state: {
    ...state,
    constants: {
      COUNTRY_TYPES,
      PARTY_TYPES,
    },
  },
});

describe('updatePartyTypeAction', () => {
  it('sets the partyType to Petitioner when filingType is updated to Myself', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'filingType',
        value: 'Myself',
      }),
    );
    expect(state.form.partyType).toEqual('Petitioner');
  });

  it('sets the partyType to "Petitioner & Deceased Spouse" when "isSpouseDeceased" is updated to "Yes"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'isSpouseDeceased',
        value: 'Yes',
      }),
    );
    expect(state.form.partyType).toEqual('Petitioner & Deceased Spouse');
  });

  it('sets the partyType to "Petitioner & Spouse" when "isSpouseDeceased" is updated to "No"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'isSpouseDeceased',
        value: 'No',
      }),
    );
    expect(state.form.partyType).toEqual('Petitioner & Spouse');
  });

  it('sets the partyType to "Donor" when "otherType" is updated to "Donor"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: 'Donor',
      }),
    );
    expect(state.form.partyType).toEqual('Donor');
  });

  it('sets the partyType to "Transferee" when "otherType" is updated to "Transferee"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: 'Transferee',
      }),
    );
    expect(state.form.partyType).toEqual('Transferee');
  });

  it('sets the partyType to "Surviving Spouse" when "otherType" is updated to "Deceased Spouse"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: 'Deceased Spouse',
      }),
    );
    expect(state.form.partyType).toEqual('Surviving Spouse');
  });

  it('sets the partyType to the props.value passed in when key is "businessType"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'businessType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
  });

  it('sets the partyType to the props.value passed in when the key is "estateType" and set form.otherType to "An estate or trust"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'estateType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
    expect(state.form.otherType).toEqual('An estate or trust');
  });

  it('sets the partyType to the props.value passed in when the key is "minorIncompetentType" and set form.otherType to "A minor or incompetent person"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'minorIncompetentType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
    expect(state.form.otherType).toEqual(
      'A minor or legally incompetent person',
    );
  });

  it('resets the state.petition.ownershipDisclosureFile and state.form.businessTyp when form.filingType is anything other than "A business"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'anything',
          value: 'Any Value',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            businessType: 'some value',
            filingType: 'Not A business',
          },
          petition: {
            ownershipDisclosureFile: 'a file',
          },
        },
      ),
    );
    expect(state.form.businessType).toBeUndefined();
    expect(state.petition.ownershipDisclosureFile).toBeUndefined();
  });

  it('does not clear the petition.ownershipDisclosureFile and form.businessType when form.filingType is "A business"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'anything',
          value: 'Any Value',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            businessType: 'some value',
            filingType: 'A business',
          },
          petition: {
            ownershipDisclosureFile: 'a file',
          },
        },
      ),
    );
    expect(state.form.businessType).toEqual('some value');
    expect(state.petition.ownershipDisclosureFile).toEqual('a file');
  });

  it('sets form.contactPrimary and form.contactSecondary to empty objects', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'anything',
          value: 'Any Value',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            contactPrimary: 'some value',
            contactSecondary: 'some other value',
          },
        },
      ),
    );
    expect(state.form.contactPrimary).toEqual({});
    expect(state.form.contactSecondary).toEqual({});
  });
});
