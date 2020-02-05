import { Button } from '../../ustc-ui/Button/Button';
import { CaseInfo } from './CaseInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRSNotice } from './IRSNotice';
import { PartyInformation } from './PartyInformation';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailEdit = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
    screenMetadata: state.screenMetadata,
    submitCaseDetailEditSaveSequence:
      sequences.submitCaseDetailEditSaveSequence,
    unsetFormSaveSuccessSequence: sequences.unsetFormSaveSuccessSequence,
    waitingForResponse: state.waitingForResponse,
  },
  ({
    navigateBackSequence,
    screenMetadata,
    submitCaseDetailEditSaveSequence,
    unsetFormSaveSuccessSequence,
    waitingForResponse,
  }) => {
    return (
      <div
        id="case-edit-form"
        role="form"
        onFocus={() => {
          unsetFormSaveSuccessSequence();
        }}
      >
        <Tabs
          boxed
          bind="documentDetail.tab"
          className="container-tabs tab-button-h3"
          id="case-detail-tabs"
        >
          <Tab id="tab-parties" tabName="partyInfo" title="Parties">
            <PartyInformation />
          </Tab>
          <Tab id="tab-case-info" tabName="caseInfo" title="Case Info">
            <CaseInfo />
          </Tab>
          <Tab id="tab-irs-notice" tabName="irsNotice" title="IRS Notice">
            <IRSNotice />
          </Tab>
        </Tabs>

        <Button
          aria-disabled={waitingForResponse ? 'true' : 'false'}
          disabled={waitingForResponse}
          secondary={!waitingForResponse}
          type="button"
          onClick={() => submitCaseDetailEditSaveSequence()}
        >
          {waitingForResponse && <div className="spinner" />}
          Save
        </Button>
        <Button link onClick={() => navigateBackSequence()}>
          Cancel
        </Button>
        {screenMetadata.showSaveSuccess && (
          <span aria-live="polite" className="mini-success" role="alert">
            <FontAwesomeIcon icon="check-circle" size="sm" />
            Your changes have been saved.
          </span>
        )}
      </div>
    );
  },
);
