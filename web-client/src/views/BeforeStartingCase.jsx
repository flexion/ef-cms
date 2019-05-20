import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MAX_FILE_SIZE_MB } from '../../../shared/src/persistence/s3/getUploadPolicy';
import React from 'react';
import howToMergePDFs from '../pdfs/how-to-merge-pdfs.pdf';
import paperclipSlashIcon from '../images/paperclip-no-icon.svg';

export const BeforeStartingCase = () => (
  <>
    <div className="big-blue-header">
      <div className="grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-6">
            <h1 className="captioned" tabIndex="-1">
              <span className="show-on-mobile">Petition Filing Guide</span>
              <span className="hide-on-mobile">File a Petition</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <section className="usa-section before-starting-case grid-container">
      <h1 className="captioned" tabIndex="-1">
        Before you begin…
      </h1>
      <h2 className="tablet:margin-bottom-7">
        There are a few things you need to do to prepare your documents before
        filing your case.
      </h2>

      <div className="grid-container padding-x-0" role="list">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6">
            <div role="listitem">
              <div className="fa-before" role="display">
                <FontAwesomeIcon icon={['far', 'copy']} />
              </div>
              <div className="before-explanation">
                <h3>
                  1. Have the IRS Notice(s) Youʼve Received Available to Submit
                </h3>
                <p>
                  If you’ve received an IRS notice, such as a Notice of
                  Deficiency or Notice of Determination, you’ll need to include
                  a copy with your Petition. The U.S. Tax Court must receive all
                  Petitions in a timely manner. The IRS notice shows the last
                  date to file or the number of days you have to file a
                  Petition.{' '}
                  <strong>
                    The Court must receive your electronically filed Petition no
                    later than 11:59 pm Eastern Time on the last date to file.
                  </strong>
                </p>
              </div>
            </div>
            <div role="listitem" className="margin-bottom-0">
              <div className="fa-before" role="display">
                <FontAwesomeIcon icon={['far', 'edit']} />
              </div>
              <div className="before-explanation">
                <h3>2. Fill Out The Required Forms</h3>
                <p className="label">Petition Form</p>
                <p>
                  Complete the Petition form,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    USTC Form 2
                  </a>
                  , or you can upload your own Petition that complies with the
                  requirements of the{' '}
                  <a
                    href="https://www.ustaxcourt.gov/rules.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tax Court Rules of Practice and Procedure
                  </a>
                  . <strong>Do not</strong> include personal information (such
                  as Social Security Numbers, Taxpayer Identification Numbers,
                  or Employer Identification Numbers, birthdates, names of minor
                  children, or financial account information) in your Petition.
                </p>
                <p className="label">Statement of Taxpayer Identification</p>
                <p>
                  Complete the Statement of Taxpayer Identification form,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    USTC Form 4
                  </a>
                  . This is the only document that should contain your Social
                  Security Number (SSN), Taxpayer Identification Number (TIN),
                  or Employer Identification Number (EIN). This document is sent
                  to the IRS to help identify you, but it’s never viewed by the
                  Court or stored as part of the public record.
                </p>
                <p className="label">Ownership Disclosure Statement</p>
                <p>
                  If you’re filing for a business, you’ll need to complete and
                  submit the Ownership Disclosure Statement,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    USTC Form 6
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6">
            <div role="listitem">
              <div className="fa-before" role="display">
                <FontAwesomeIcon icon={['fa', 'shield-alt']} />
              </div>
              <div className="before-explanation">
                <h3>
                  3. Remove Personal Information From Your Petition and IRS
                  Notice(s)
                </h3>
                <p>
                  If the IRS notice includes personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers), remove or redact that
                  information before including it with your Petition. You can
                  remove this information by deleting it, marking through it so
                  itʼs illegible, or any other method that will prevent it from
                  being seen.
                </p>
              </div>
            </div>

            <div role="listitem">
              <div className="fa-before" role="display">
                <FontAwesomeIcon icon={['far', 'file-pdf']} />
              </div>
              <div className="before-explanation">
                <h3>
                  4. Combine Your Petition and IRS Notice(s) Into a Single PDF
                </h3>
                <p>
                  Scan your Petition and IRS notice into one Petition PDF or
                  combine them digitally. This is what youʼll upload to the
                  Court to start your case. Uploads are limited to{' '}
                  {MAX_FILE_SIZE_MB}MB.{' '}
                  <a
                    href={howToMergePDFs}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more about how to merge files into one PDF.
                  </a>
                </p>
              </div>
            </div>
            <div role="listitem">
              <div className="fa-before" role="display">
                <div className="svg-wrapper">
                  <img
                    src={paperclipSlashIcon}
                    className="svg"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="before-explanation">
                <h3>5. Donʼt Submit Extra Documents With Your Petition</h3>
                <p>
                  <strong>Do not</strong> include any additional documents with
                  your Petition, except for the IRS notice. Documents that might
                  be evidence can be submitted at a later time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-box-container">
        <a className="usa-button" href="/start-a-case">
          Got It, Letʼs Start My Case
        </a>
        <a className="usa-button usa-button--outline" href="/">
          Cancel
        </a>
      </div>
    </section>
  </>
);
