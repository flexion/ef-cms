const React = require('react');

const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfReceiptOfPetition = ({
  address,
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  preferredTrialCity,
  receivedAtFormatted,
  servedDate,
}) => {
  return (
    <>
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        h3="NOTIFICATION OF RECEIPT OF PETITION"
      />
      <div>
        The Court received and filed your petition on {receivedAtFormatted} and
        served it on respondent on {servedDate}.
      </div>

      <div className="margin-top-5 margin-bottom-20">
        (X) Request for Place of Trial at {preferredTrialCity}.
      </div>

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">
          Your Docket Number: {docketNumberWithSuffix}
        </div>
        <div className="info-box-content">
          Please use this docket number on all papers and correspondence that
          you send to the Tax Court. Do not include your Social Security or
          Taxpayer Identification numbers on any documents you file with the
          Court.
        </div>
      </div>

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">Internet Access:</div>
        <div className="info-box-content">
          To obtain further information about proceeding in the Tax Court,
          please visit{' '}
          <strong>
            <a href="http://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          </strong>{' '}
          and select &quot;Taxpayer Identification&quot;.
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">Change of Address:</div>
        <div className="info-box-content">
          You must notify the Clerk of the Court if you change your address. If
          you filed your petition in paper, see Tax Court Form 10, Notice of
          Change of Address, under “Forms” on the Tax Court’s Website at{' '}
          <strong>
            <a href="http://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          </strong>
          . If you filed your petition electronically, you may update your
          address under the “Case Information” tab in your case online. Failure
          to notify the Clerk of the Court of a change of your address can mean
          you do not receive notices and documents essential to your case and
          can lead to dismissal of your case.
        </div>
      </div>

      <p className="float-right width-third">
        Stephanie A. Servoss
        <br />
        Clerk of the Court
      </p>

      <div id="address-label-cover-sheet">
        <div className="address">
          <div>{address.name}</div>
          <div>{address.address1}</div>
          {address.address2 && <div>{address.address2}</div>}
          {address.address3 && <div>{address.address3}</div>}
          <div>
            {address.city}, {address.state} {address.postalCode}
          </div>
          {!address.address3 && <div>{address.countryName}</div>}
        </div>
      </div>
    </>
  );
};
