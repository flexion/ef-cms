import {
  ALL_STATE_OPTIONS,
  BUSINESS_TYPES,
  CASE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FileUploadErrorModal } from '@web-client/views/FileUploadErrorModal';
import { FileUploadStatusModal } from '@web-client/views/FileUploadStatusModal';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep6 = connect(
  {
    form: state.form,
    petitionFormatted: state.petitionFormatted,
    showModal: state.modal.showModal,
    user: state.user,
  },

  function UpdatedFilePetitionStep6({
    form,
    petitionFormatted,
    showModal,
    user,
  }) {
    const isAutoGenerated = form.petitionType === PETITION_TYPES.autoGenerated;

    return (
      <>
        <ErrorNotification />
        <div>
          <div>
            <p className="margin-top-0">
              Review the information to make sure it is accurate. If you want to
              make a change, use the Back button at the bottom or Edit link in
              each section. You will not be able to make changes to your case
              once you create it without filing a motion.
            </p>
            <InfoNotificationComponent
              alertInfo={{
                message:
                  'Your petition will not be created with the Court until the Submit Documents & Create Case button is clicked.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
            <div className="padding-x-0">
              <div>
                <div>
                  <PetitionerInformation
                    petitionFormatted={petitionFormatted}
                    userEmail={user.email}
                  />
                </div>
                <div>
                  <PetitionInformation
                    isAutoGenerated={isAutoGenerated}
                    petitionFormatted={petitionFormatted}
                  />
                </div>
                <div>
                  <IRSNoticeInformation petitionFormatted={petitionFormatted} />
                </div>
                <div>
                  <CaseInformation petitionFormatted={petitionFormatted} />
                </div>
                <div>
                  <STINInformation petitionFormatted={petitionFormatted} />
                </div>
              </div>
            </div>

            <div className="margin-bottom-5">
              <div className="bg-white submit-reminders">
                <div className="card margin-top-2 margin-bottom-3">
                  <div className="content-header bg-accent-cool-dark text-white heading-3">
                    A Few Reminders Before You Submit
                  </div>
                  <div className="content-wrapper line-height-2">
                    <ol className="petitioner-review-list">
                      <li>
                        <b>
                          In most cases, the Court must receive your
                          electronically filed Petition no later than 11:59 pm
                          Eastern Time on the last date to file.
                        </b>
                      </li>
                      <li>
                        Do not combine any additional documents with your
                        Petition.{' '}
                        <b>
                          Additional documents may be submitted after your
                          Petition has been processed.
                        </b>
                      </li>
                      <li>
                        Confirm that all information being submitted appears as
                        you want it to appear.{' '}
                        <b>
                          After submitting your petition to the Court, you will
                          only be able to make changes by filing a motion.
                        </b>
                      </li>
                    </ol>
                  </div>
                </div>
                <WarningNotificationComponent
                  alertWarning={{
                    message:
                      'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) from every form except the Statement of Taxpayer Identification Number.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />

                <div className="margin-top-4">
                  <UpdatedFilePetitionButtons primaryLabel="Submit Documents & Create Case" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && <FileUploadErrorModal />}
      </>
    );
  },
);

function PetitionerInformation({ petitionFormatted, userEmail }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={1} title="Petitioner Information" />
        <div className="petition-review-petitioner-section">
          <div>
            <span className="usa-label usa-label-display">Party type</span>
            <div data-testid="party-type">{petitionFormatted.partyType}</div>
            {petitionFormatted.corporateDisclosureFile && (
              <div className="margin-top-3">
                <span
                  className="usa-label usa-label-display"
                  data-testid="corporate-disclosure-file-title"
                >
                  Corporate Disclosure Statement
                </span>
                <div>
                  <div>
                    <div className="grid-col flex-auto">
                      <Button
                        link
                        className="padding-0 text-left word-break"
                        data-testid="cds-preview-button"
                        href={petitionFormatted.corporateDisclosureFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {petitionFormatted.corporateDisclosureFile.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="petition-review-spacing">
            <div>
              <span
                className="usa-label usa-label-display"
                id="filing-contact-primary"
              >
                Petitioner contact information
              </span>
              {petitionFormatted.contactPrimary && (
                <address aria-labelledby="filing-contact-primary">
                  <AddressDisplay
                    noMargin
                    contact={petitionFormatted.contactPrimary}
                  />
                  <div className="margin-top-1">
                    <span
                      className="text-semibold"
                      data-testid="place-of-legal-residence-label"
                    >
                      {Object.values(BUSINESS_TYPES).includes(
                        petitionFormatted.partyType,
                      )
                        ? 'Place of business:'
                        : 'Place of legal residence:'}
                    </span>
                    <span
                      className="margin-left-05"
                      data-testid="primary-place-of-legal-residence"
                    >
                      {petitionFormatted.contactPrimary.placeOfLegalResidence
                        ? ALL_STATE_OPTIONS[
                            petitionFormatted.contactPrimary
                              .placeOfLegalResidence
                          ]
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="margin-top-3">
                    <span className="usa-label usa-label-display">
                      Service email
                    </span>
                    <span data-testid="contact-primary-email">{userEmail}</span>
                  </div>
                </address>
              )}
            </div>
          </div>
          {petitionFormatted.contactSecondary && (
            <div className="petition-review-spacing">
              <div>
                <span
                  className="usa-label usa-label-display"
                  id="filing-contact-secondary"
                >
                  {"Spouse's contact information"}
                </span>
                <address aria-labelledby="filing-contact-secondary">
                  <AddressDisplay
                    noMargin
                    showEmail
                    contact={petitionFormatted.contactSecondary}
                  />
                </address>
                <div className="margin-top-1">
                  <span className="text-semibold">
                    Register for eService/filing:
                  </span>
                  <span className="margin-left-05">
                    {petitionFormatted.contactSecondary.hasConsentedToEService
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>
                <div className="margin-top-1">
                  <span className="text-semibold">
                    Place of legal residence:
                  </span>
                  <span
                    className="margin-left-05"
                    data-testid="secondary-place-of-legal-residence"
                  >
                    {petitionFormatted.contactSecondary.placeOfLegalResidence
                      ? ALL_STATE_OPTIONS[
                          petitionFormatted.contactSecondary
                            .placeOfLegalResidence
                        ]
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PetitionInformation({ isAutoGenerated, petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={2} title="Petition" />
        {!isAutoGenerated ? (
          <div>
            <Button
              link
              className="padding-0 text-left word-break"
              data-testid="petition-preview-button"
              href={petitionFormatted.petitionFileUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {petitionFormatted.petitionFile.name}
            </Button>
          </div>
        ) : (
          <>
            <div className="semi-bold">
              Reason(s) why you disagree with the IRS action(s) in this case
            </div>
            <div>
              <ol className="alpha-list margin-bottom-0">
                {petitionFormatted.petitionReasons.map(reason => (
                  <li className="alpha-list-items" key={reason}>
                    {reason}
                  </li>
                ))}
              </ol>
            </div>
            <div className="margin-top-3">
              <div className="semi-bold">Fact(s) upon which you rely</div>
              <div>
                <ol className="alpha-list margin-bottom-0">
                  {petitionFormatted.petitionFacts.map(fact => (
                    <li className="alpha-list-items" key={fact}>
                      {fact}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IRSNoticeInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={3} title="IRS Notice" />
        <div className="petition-review-irs-notice-section">
          {!petitionFormatted.hasIrsNotice && (
            <div>
              <div className="line-height-2">
                <div className="margin-bottom-1 semi-bold">
                  Type of notice/case
                </div>
                <div className="margin-bottom-2px">
                  {petitionFormatted.caseType}
                </div>
              </div>
            </div>
          )}

          {petitionFormatted.hasIrsNotice &&
            petitionFormatted.irsNotices.map((irsNotice, index) => {
              const isFirstNotice = index === 0;
              return (
                <div
                  className={classNames(
                    'line-height-2',
                    !isFirstNotice && 'petition-review-spacing',
                  )}
                  key={`${irsNotice.caseType}`}
                >
                  <div className="margin-bottom-1 semi-bold">
                    IRS notice {index + 1}
                  </div>
                  <div className="margin-bottom-2px">
                    {formatCaseType(irsNotice.caseType)}
                  </div>
                  {irsNotice.taxYear && (
                    <div className="margin-bottom-2px">{irsNotice.taxYear}</div>
                  )}
                  {irsNotice.noticeIssuedDate && (
                    <div className="margin-bottom-2px">
                      {irsNotice.noticeIssuedDateFormatted}
                    </div>
                  )}
                  {irsNotice.cityAndStateIssuingOffice && (
                    <div className="margin-bottom-2px">
                      {irsNotice.cityAndStateIssuingOffice}
                    </div>
                  )}
                  {irsNotice.irsNoticeFileUrl && (
                    <Button
                      link
                      className="padding-0 text-left word-break"
                      data-testid="atp-preview-button"
                      href={irsNotice.irsNoticeFileUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {irsNotice.file.name}
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function CaseInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={4} title="Case Procedure and Trial Location" />
        <div className="petition-review-case-information-section">
          <div className="line-height-2">
            <div className="margin-bottom-1 semi-bold">Case procedure</div>
            <div>{petitionFormatted.procedureType}</div>
          </div>
          <div className="line-height-2 petition-review-spacing">
            <div className="margin-bottom-1 semi-bold">
              Requested trial location
            </div>
            <div className="margin-bottom-1">
              {petitionFormatted.preferredTrialCity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function STINInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader
          step={5}
          title="Statement of Taxpayer Identification Number"
        />
        <div>
          <Button
            link
            className="padding-0 text-left word-break"
            data-testid="stin-preview-button"
            href={petitionFormatted.stinFileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {petitionFormatted.stinFile.name}
          </Button>
        </div>
      </div>
    </div>
  );
}

const props = cerebralProps as unknown as {
  step: number;
  title: string;
};

const CardHeader = connect(
  {
    step: props.step,
    title: props.title,
    updateStepIndicatorSequence: sequences.updateStepIndicatorSequence,
  },
  function CardHeader({ step, title, updateStepIndicatorSequence }) {
    return (
      <h3 className="create-petition-review-step-title">
        <div>
          {step}. {title}
        </div>
        <div>
          <Button
            link
            className="margin-left-2 padding-0"
            data-testid={`edit-petition-section-button-${step}`}
            icon="edit"
            onClick={() => {
              updateStepIndicatorSequence({ step });
            }}
          >
            Edit
          </Button>
        </div>
      </h3>
    );
  },
);

function formatCaseType(caseType: string) {
  if (caseType === 'Disclosure1' || caseType === 'Disclosure2') {
    return CASE_TYPES_MAP.disclosure;
  }
  return caseType;
}
