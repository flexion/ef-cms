# Document
 ```
---
  type: "object"
  keys: 
    addToCoversheet: 
      type: "boolean"
      flags: 
        presence: "optional"
    additionalInfo: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    additionalInfo2: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    archived: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "A document that was archived instead of added to the Docket Record."
    certificateOfService: 
      type: "boolean"
      flags: 
        presence: "optional"
    certificateOfServiceDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      whens: 
        - 
          ref: 
            path: 
              - "certificateOfService"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the Document was added to the system."
    date: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "An optional date used when generating a fully concatenated document title."
      allow: 
        - null
    docketNumber: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Docket Number of the associated Case in XXXXX-YY format."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumbers: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Optional Docket Number text used when generating a fully concatenated document title."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    documentContentsId: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The S3 ID containing the text contents of the document."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    documentId: 
      type: "string"
      flags: 
        presence: "required"
        description: "ID of the associated PDF document in the S3 bucket."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    documentTitle: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The title of this document."
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    documentType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The type of this document."
      allow: 
        - "Application for Waiver of Filing Fee"
        - "Ownership Disclosure Statement"
        - "Petition"
        - "Request for Place of Trial"
        - "Statement of Taxpayer Identification"
        - "Entry of Appearance"
        - "Substitution of Counsel"
        - "Answer"
        - "Answer to Amended Petition"
        - "Answer to Amended Petition, as Amended"
        - "Answer to Amendment to Amended Petition"
        - "Answer to Amendment to Petition"
        - "Answer to Petition, as Amended"
        - "Answer to Second Amended Petition"
        - "Answer to Second Amendment to Petition"
        - "Answer to Supplement to Petition"
        - "Answer to Third Amended Petition"
        - "Answer to Third Amendment to Petition"
        - "Designation of Counsel to Receive Service"
        - "Motion to Withdraw as Counsel"
        - "Motion to Withdraw Counsel (filed by petitioner)"
        - "Application for Waiver of Filing Fee and Affidavit"
        - "Application to Take Deposition"
        - "Agreed Computation for Entry of Decision"
        - "Computation for Entry of Decision"
        - "Proposed Stipulated Decision"
        - "Revised Computation"
        - "Administrative Record"
        - "Amended"
        - "Amended Certificate of Service"
        - "Amendment [anything]"
        - "Certificate as to the Genuineness of the Administrative Record"
        - "Certificate of Service"
        - "Civil Penalty Approval Form"
        - "Exhibit(s)"
        - "Memorandum"
        - "Partial Administrative Record"
        - "Ratification"
        - "Redacted"
        - "Report"
        - "Status Report"
        - "Motion for Continuance"
        - "Motion for Extension of Time"
        - "Motion to Dismiss for Lack of Jurisdiction"
        - "Motion to Dismiss for Lack of Prosecution"
        - "Motion for Summary Judgment"
        - "Motion to Change or Correct Caption"
        - "Motion for a New Trial"
        - "Motion for an Order under Federal Rule of Evidence 502(d)"
        - "Motion for an Order under Model Rule of Professional Conduct 4.2"
        - "Motion for Appointment of Mediator"
        - "Motion for Assignment of Judge"
        - "Motion for Audio of Trial Proceeding(s)"
        - "Motion for Certification of an Interlocutory Order to Permit Immediate Appeal"
        - "Motion for Default and Dismissal"
        - "Motion for Entry of Decision"
        - "Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)"
        - "Motion for Estate Tax Deduction Developing at or after Trial Pursuant to Rule 156"
        - "Motion for in Camera Review"
        - "Motion for International Judicial Assistance"
        - "Motion for Judgment on the Pleadings"
        - "Motion for Leave to Conduct Discovery Pursuant to Rule 70(a)(2)"
        - "Motion for Leave to File"
        - "Motion for Leave to File Out of Time"
        - "Motion for Leave to Serve Additional Interrogatories"
        - "Motion for Leave to Use Electronic Equipment"
        - "Motion for More Definite Statement Pursuant to Rule 51"
        - "Motion for Non-Binding Mediation"
        - "Motion for Oral Argument"
        - "Motion for Order Fixing Amount of an Appeal Bond"
        - "Motion for Order to Release the Amount of an Appeal Bond"
        - "Motion for Order to Show Cause Why Case Should Not Be Sumitted on the Basis of the Administrative Record"
        - "Motion for Order to Show Cause Why Judgment Should Not be Entered on the Basis of a Previously Decided Case"
        - "Motion for Order to Show Cause Why Proposed Facts and Evidence Should Not be Accepted as Established Pursuant to Rule 91(f)"
        - "Motion for Partial Summary Judgment"
        - "Motion for Pretrial Conference"
        - "Motion for Protective Order Pursuant to Rule 103"
        - "Motion for Reasonable Litigation or Administrative Costs"
        - "Motion for Reconsideration of Findings or Opinion Pursuant to Rule 161"
        - "Motion for Reconsideration of Order"
        - "Motion for Recusal of Judge"
        - "Motion for Review of Jeopardy Assessment or Jeopardy Levy Pursuant to Rule 56"
        - "Motion for the Court to Pay the Expenses of a Transcript"
        - "Motion for the Court to Pay the Expenses of an Interpreter"
        - "Motion for Voluntary Binding Arbitration"
        - "Motion for Writ of Habeas Corpus Ad Testificandum"
        - "Motion in Limine"
        - "Motion to Add Lien or Levy Designation"
        - "Motion to Add Small Tax case Designation"
        - "Motion to Amend Order"
        - "Motion to Appoint an Interpreter Pursuant to Rule 143(f)"
        - "Motion to Appoint New Tax Matters Partner"
        - "Motion to Appoint Tax Matters Partner"
        - "Motion to Authorize Proposed Sale of Seized Property"
        - "Motion to Be Excused from Appearing at the Trial Session"
        - "Motion to Be Recognized as Next Friend"
        - "Motion to Bifurcate"
        - "Motion to Calendar"
        - "Motion to Calendar and Consolidate"
        - "Motion to Calendar in the Electronic (North) Courtroom"
        - "Motion to Certify for Interlocutory Appeal"
        - "Motion to Change or Correct Docket Entry"
        - "Motion to Change Place of Submission of Declaratory Judgment Case"
        - "Motion to Change Place of Trial"
        - "Motion to Change Service Method"
        - "Motion to Clarify Order"
        - "Motion to Close on Ground of Duplication"
        - "Motion to Compel Discovery"
        - "Motion to Compel Production of Documents"
        - "Motion to Compel Responses to Interrogatories"
        - "Motion to Compel the Taking of Deposition"
        - "Motion to Conform the Pleadings to the Proof"
        - "Motion to Consolidate"
        - "Motion to Correct and Certify Record on Appeal"
        - "Motion to Correct Clerical Order"
        - "Motion to Correct Transcript"
        - "Motion to Depose Pursuant to Rule 74"
        - "Motion to Determine the Tax Matters Partner"
        - "Motion to Dismiss"
        - "Motion to Dismiss for Failure to Properly Prosecute"
        - "Motion to Dismiss for Failure to State a Claim upon Which Relief Can Be Granted"
        - "Motion to Dismiss for Lack of Jurisdiction as to [person, notice, or year]"
        - "Motion to Dismiss on Grounds of Mootness"
        - "Motion to Disqualify Counsel"
        - "Motion to Enforce a Refund of Overpayment Pursuant to Rule 260"
        - "Motion to Enforce Subpoena"
        - "Motion to Extend Time to Move or File Answer"
        - "Motion to Impose a Penalty"
        - "Motion to Impose Sanctions"
        - "Motion to Modify Decision in Estate Tax Case Pursuant to Rule 262"
        - "Motion to Modify Order"
        - "Motion to Permit Expert Witness to Testify without a Written Report Regarding Industry Practice Pursuant to Rule 143(g)(3)"
        - "Motion to Permit Levy"
        - "Motion to Preclude"
        - "Motion to Quash or Modify Subpoena"
        - "Motion to Redetermine Interest Pursuant to Rule 261"
        - "Motion to Remand"
        - "Motion to Remove Lien/Levy Designation"
        - "Motion to Remove Small Tax Case Designation"
        - "Motion to Remove Tax Matters Partner"
        - "Motion to Reopen the Record"
        - "Motion to Require Petitioner to File a Reply in a Small Tax Case Pursuant to Rule 173(c)"
        - "Motion to Restore Case to the General Docket"
        - "Motion to Restrain Assessment or Collection or to Order Refund of Amount Collected"
        - "Motion to Retain File in Estate Tax Case Involving § 6166 Election Pursuant to Rule 157"
        - "Motion to Review the Sufficiency of Answers or Objections to Request for Admissions"
        - "Motion to Seal"
        - "Motion to Set for a Time & Date Certain"
        - "Motion to Set Pretrial Scheduling Order"
        - "Motion to Sever"
        - "Motion to Shift the Burden of Proof"
        - "Motion to Shorten the Time"
        - "Motion to Stay Proceedings"
        - "Motion to Stay Proposed Sale of Seized Property"
        - "Motion to Strike"
        - "Motion to Submit Case Pursuant to Rule 122"
        - "Motion to Substitute Parties and Change Caption"
        - "Motion to Substitute Trial Exhibit(s)"
        - "Motion to Supplement the Record"
        - "Motion to Suppress Evidence"
        - "Motion to Take Deposition Pursuant to Rule 74(c)(3)"
        - "Motion to Take Judicial Notice"
        - "Motion to Vacate"
        - "Motion to Vacate or Revise Pursuant to Rule 162"
        - "Motion to Withdraw"
        - "Motion to Withdraw or Modify the Deemed Admitted Admissions Pursuant to Rule 90(f)"
        - "Notice of Abatement of Jeopardy Assessment"
        - "Notice of Appeal"
        - "Notice of Change of Address"
        - "Notice of Change of Address and Telephone Number"
        - "Notice of Change of Telephone Number"
        - "Notice of Clarification of Tax Matters Partner"
        - "Notice of Concession"
        - "Notice of Consistent Agreement Pursuant to Rule 248(c)(1)"
        - "Notice of Death of Counsel"
        - "Notice of Filing of Petition and Right to Intervene"
        - "Notice of Filing of the Administrative Record"
        - "Notice of Identification of Tax Matters Partner"
        - "Notice of Intent Not to File"
        - "Notice of Issue Concerning Foreign Law"
        - "Notice of Jeopardy Assessment"
        - "Notice of Judicial Ruling"
        - "Notice of No Objection"
        - "Notice of Objection"
        - "Notice of Partial Abatement of Jeopardy Assessment"
        - "Notice of Proceeding in Bankruptcy"
        - "Notice of Relevant Judicial Decisions"
        - "Notice of Settlement Agreement Pursuant to Rule 248(c)(1)"
        - "Notice of Small Tax Case Election"
        - "Notice of Supplemental Authority"
        - "Notice of Telephone Number"
        - "Notice of Termination Assessment"
        - "Notice of Unavailability"
        - "Redacted Petition Filed"
        - "Prehearing Memorandum"
        - "Pretrial Memorandum"
        - "Reply"
        - "Sur-Reply"
        - "Request for Admissions"
        - "Request for Judicial Notice"
        - "Request for Pretrial Conference"
        - "No Objection"
        - "Objection"
        - "Opposition"
        - "Response"
        - "Seriatim Answering Brief"
        - "Seriatim Answering Memorandum Brief"
        - "Seriatim Opening Brief"
        - "Seriatim Opening Memorandum Brief"
        - "Seriatim Reply Brief"
        - "Seriatim Reply Memorandum Brief"
        - "Seriatim Sur-Reply Brief"
        - "Seriatim Sur-Reply Memorandum Brief"
        - "Simultaneous Answering Brief"
        - "Simultaneous Answering Memoranda of Law"
        - "Simultaneous Answering Memorandum Brief"
        - "Simultaneous Memoranda of Law"
        - "Simultaneous Opening Brief"
        - "Simultaneous Opening Memorandum Brief"
        - "Simultaneous Reply Brief"
        - "Simultaneous Supplemental Brief"
        - "Simultaneous Sur-Reply Brief"
        - "Simultaneous Sur-Reply Memorandum Brief"
        - "Statement"
        - "Statement of Redacted Information"
        - "Statement under Rule 212"
        - "Statement under Rule 50(c)"
        - "Settlement Stipulation"
        - "Stipulation"
        - "Stipulation as to the Administrative Record"
        - "Stipulation as to the Partial Administrative Record"
        - "Stipulation of Facts"
        - "Stipulation of Pretrial Deadlines"
        - "Stipulation of Settled Issues"
        - "Stipulation of Settlement"
        - "Stipulation to Be Bound"
        - "Stipulation to Take Deposition"
        - "Supplement"
        - "Supplemental"
        - "Affidavit in Support"
        - "Brief in Support"
        - "Declaration in Support"
        - "Memorandum in Support"
        - "Unsworn Declaration under Penalty of Perjury in Support"
        - "Application"
        - "Application for Examination Pursuant to Rule 73"
        - "Amended [Document Name]"
        - "Appellate Filing Fee Received"
        - "Bond"
        - "Bounced Electronic Service"
        - "Evidence"
        - "Hearing Exhibits"
        - "Letter"
        - "Miscellaneous"
        - "Miscellaneous (Lodged)"
        - "Reference List of Redacted Information"
        - "Returned Mail"
        - "Trial Exhibits"
        - "U.S.C.A. [Anything]"
        - "Motion"
        - "Motion for Review By the Full Court"
        - "Motion for Review En Banc"
        - "Motion to Be Exempt from E-Filing"
        - "Motion to Change Place of Hearing of Disclosure Case"
        - "Motion to File Document Under Seal"
        - "Motion to Intervene"
        - "Motion to Proceed Anonymously"
        - "Notice"
        - "Notice of Change of Counsel for Non-Party"
        - "Notice of Election to Intervene"
        - "Notice of Election to Participate"
        - "Notice of Intervention"
        - "Ratification of Petition"
        - "Request"
        - "Objection [anything]"
        - "Opposition [anything]"
        - "Response [anything]"
        - "Supplement To [anything]"
        - "Supplemental [anything]"
        - "Order"
        - "Order of Dismissal for Lack of Jurisdiction"
        - "Order of Dismissal"
        - "Order of Dismissal and Decision"
        - "Order to Show Cause"
        - "Order and Decision"
        - "Decision"
        - "O - Order"
        - "OAJ - Order that case is assigned"
        - "OAL - Order that the letter \"L\" is added to Docket number"
        - "OAP - Order for Amended Petition"
        - "OAPF - Order for Amended Petition and Filing Fee"
        - "OAR - Order that the letter \"R\" is added to the Docket number"
        - "OAS - Order that the letter \"S\" is added to the Docket number"
        - "OASL - Order that the letters \"SL\" are added to the Docket number"
        - "OAW - Order that the letter \"W\" is added to the Docket number"
        - "OAX - Order that the letter \"X\" is added to the Docket number"
        - "OCA - Order that caption of case is amended"
        - "OD - Order of Dismissal Entered"
        - "ODD - Order of Dismissal and Decision Entered"
        - "ODL - Order that the letter \"L\" is deleted from the Docket number"
        - "ODP - Order that the letter \"P\" is deleted from the Docket number"
        - "ODR - Order that the letter \"R\" is deleted from the Docket number"
        - "ODS - Order that the letter \"S\" is deleted from the Docket number"
        - "ODSL - Order that the letters \"SL\" are deleted from the Docket number"
        - "ODW - Order that the letter \"W\" is deleted from the Docket number"
        - "ODX - Order that the letter \"X\" is deleted from the Docket number"
        - "OF - Order for Filing Fee"
        - "OFAB - Order fixing amount of bond"
        - "OFFX - Order time is extended for petr(s) to pay the filing fee"
        - "OFWD - Order for Filing Fee. Application waiver of Filing Fee is denied."
        - "OFX - Order time is extended for petr(s) to pay filing fee or submit an Application for Waiver of Filing fee"
        - "OIP - Order that the letter \"P\" is added to the Docket number"
        - "OJR - Order that jurisdiction is retained"
        - "OODS - Order for Ownership Disclosure Statement"
        - "OPFX - Order time is extended for petr(s) to file Amended Petition and pay the Filing Fee or submit an Application for Waiver of Filing Fee"
        - "OPX - Order time is extended for petr(s) to file Amended Petition"
        - "ORAP - Order for Amendment to Petition"
        - "OROP - Order for Ratification of Petition"
        - "OSC - Order"
        - "OSCP - Order petr(s) to show cause why \"S\" should not be removed"
        - "OST - Order of Service of Transcript (Bench Opinion)"
        - "OSUB - Order that case is submitted"
        - "DEC - Decision Entered"
        - "OAD - Order and Decision Entered"
        - "ODJ - Order of Dismissal for Lack of Jurisdiction Entered"
        - "SDEC - Stipulated Decision Entered"
        - "MOP - Memorandum Opinion"
        - "NOT - Notice"
        - "Summary Opinion"
        - "Writ of Habeas Corpus Ad Testificandum"
        - "CTRA - Corrected Transcript"
        - "FTRL - Further Trial before ..."
        - "HEAR - Hearing before ..."
        - "NTD - Notice of Trial"
        - "PTRL - Partial Trial before ..."
        - "TRL - Trial before ..."
        - "ROA - Record on Appeal"
        - "TCOP - T.C. Opinion"
        - "RTRA - Revised Transcript"
        - "TRAN - Transcript"
        - "SPTO - Standing Pre-Trial Order"
        - "MISC - Miscellaneous"
        - "Stipulated Decision"
        - "Notice of Docket Change"
        - "Notice of Trial"
        - "Standing Pretrial Notice"
        - "Standing Pretrial Order"
    draftState: 
      type: "object"
      flags: 
        presence: "optional"
      allow: 
        - null
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Document"
    eventCode: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "A"
        - "AAAP"
        - "AAPN"
        - "AATP"
        - "AATS"
        - "AATT"
        - "ACED"
        - "ADMR"
        - "ADMT"
        - "AFE"
        - "AFF"
        - "AFP"
        - "AMAT"
        - "AMDC"
        - "APA"
        - "APLD"
        - "APPL"
        - "APPW"
        - "APW"
        - "ASAP"
        - "ASUP"
        - "ATAP"
        - "ATSP"
        - "BND"
        - "BRF"
        - "CERT"
        - "CIVP"
        - "COED"
        - "CS"
        - "CTRA"
        - "DCL"
        - "DEC"
        - "DISC"
        - "DSC"
        - "EA"
        - "ES"
        - "EVID"
        - "EXH"
        - "FEE"
        - "FEEW"
        - "FTRL"
        - "HE"
        - "HEAR"
        - "LTR"
        - "M000"
        - "M001"
        - "M002"
        - "M003"
        - "M004"
        - "M005"
        - "M006"
        - "M007"
        - "M008"
        - "M009"
        - "M010"
        - "M011"
        - "M012"
        - "M013"
        - "M014"
        - "M015"
        - "M016"
        - "M017"
        - "M018"
        - "M019"
        - "M020"
        - "M021"
        - "M022"
        - "M023"
        - "M024"
        - "M026"
        - "M027"
        - "M028"
        - "M029"
        - "M030"
        - "M031"
        - "M032"
        - "M033"
        - "M034"
        - "M035"
        - "M036"
        - "M037"
        - "M038"
        - "M039"
        - "M040"
        - "M041"
        - "M042"
        - "M043"
        - "M044"
        - "M045"
        - "M046"
        - "M047"
        - "M048"
        - "M049"
        - "M050"
        - "M051"
        - "M052"
        - "M053"
        - "M054"
        - "M055"
        - "M056"
        - "M057"
        - "M058"
        - "M059"
        - "M060"
        - "M061"
        - "M062"
        - "M063"
        - "M064"
        - "M065"
        - "M066"
        - "M067"
        - "M068"
        - "M069"
        - "M070"
        - "M071"
        - "M072"
        - "M073"
        - "M074"
        - "M075"
        - "M076"
        - "M077"
        - "M078"
        - "M079"
        - "M080"
        - "M081"
        - "M082"
        - "M083"
        - "M084"
        - "M085"
        - "M086"
        - "M087"
        - "M088"
        - "M089"
        - "M090"
        - "M091"
        - "M092"
        - "M093"
        - "M094"
        - "M095"
        - "M096"
        - "M097"
        - "M098"
        - "M099"
        - "M100"
        - "M101"
        - "M102"
        - "M103"
        - "M104"
        - "M105"
        - "M106"
        - "M107"
        - "M108"
        - "M109"
        - "M110"
        - "M111"
        - "M112"
        - "M113"
        - "M114"
        - "M115"
        - "M116"
        - "M117"
        - "M118"
        - "M119"
        - "M120"
        - "M121"
        - "M122"
        - "M123"
        - "M124"
        - "M125"
        - "M126"
        - "M129"
        - "M130"
        - "M131"
        - "M132"
        - "M133"
        - "M134"
        - "M135"
        - "M136"
        - "M218"
        - "MEMO"
        - "MGRTED"
        - "MINC"
        - "MIND"
        - "MISC"
        - "MISCL"
        - "MISL"
        - "MISP"
        - "MOP"
        - "NAJA"
        - "NCA"
        - "NCAG"
        - "NCAP"
        - "NCNP"
        - "NCON"
        - "NCP"
        - "NCTP"
        - "NDC"
        - "NDT"
        - "NFAR"
        - "NIFL"
        - "NINF"
        - "NIS"
        - "NITM"
        - "NJAR"
        - "NNOB"
        - "NOA"
        - "NOB"
        - "NODC"
        - "NOEI"
        - "NOEP"
        - "NOI"
        - "NOST"
        - "NOT"
        - "NOU"
        - "NPB"
        - "NPJR"
        - "NRJD"
        - "NRJR"
        - "NSA"
        - "NSTE"
        - "NTA"
        - "NTD"
        - "NTN"
        - "O"
        - "OAD"
        - "OAJ"
        - "OAL"
        - "OAP"
        - "OAPF"
        - "OAR"
        - "OAS"
        - "OASL"
        - "OAW"
        - "OAX"
        - "OBJ"
        - "OBJE"
        - "OBJN"
        - "OCA"
        - "OD"
        - "ODD"
        - "ODJ"
        - "ODL"
        - "ODP"
        - "ODR"
        - "ODS"
        - "ODSL"
        - "ODW"
        - "ODX"
        - "OF"
        - "OFAB"
        - "OFFX"
        - "OFWD"
        - "OFX"
        - "OIP"
        - "OJR"
        - "OODS"
        - "OP"
        - "OPFX"
        - "OPPO"
        - "OPX"
        - "ORAP"
        - "OROP"
        - "OSC"
        - "OSCP"
        - "OST"
        - "OSUB"
        - "P"
        - "PARD"
        - "PHM"
        - "PMT"
        - "PSDE"
        - "PTFR"
        - "PTRL"
        - "RAT"
        - "RATF"
        - "RCOM"
        - "REDC"
        - "REPL"
        - "REQ"
        - "REQA"
        - "RESP"
        - "RFPC"
        - "RJN"
        - "RLRI"
        - "RM"
        - "ROA"
        - "RPT"
        - "RQT"
        - "RSP"
        - "RTP"
        - "RTRA"
        - "S212"
        - "SADM"
        - "SAMB"
        - "SATL"
        - "SDEC"
        - "SEAB"
        - "SEOB"
        - "SERB"
        - "SESB"
        - "SIAB"
        - "SIAM"
        - "SIMB"
        - "SIML"
        - "SIOB"
        - "SIOM"
        - "SIRB"
        - "SISB"
        - "SOC"
        - "SOMB"
        - "SOP"
        - "SORI"
        - "SPAR"
        - "SPD"
        - "SPML"
        - "SPMT"
        - "SPTN"
        - "SPTO"
        - "SRMB"
        - "SSB"
        - "SSRB"
        - "SSRM"
        - "SSTP"
        - "STAR"
        - "STAT"
        - "STBB"
        - "STIN"
        - "STIP"
        - "STP"
        - "STPD"
        - "STS"
        - "STST"
        - "SUPM"
        - "SURP"
        - "TCOP"
        - "TE"
        - "TRAN"
        - "TRL"
        - "USCA"
        - "USDL"
        - "WRIT"
        - null
    filedBy: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      allow: 
        - ""
    filingDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "Date that this Document was filed."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
    freeText: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    freeText2: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    hasSupportingDocuments: 
      type: "boolean"
      flags: 
        presence: "optional"
    isFileAttached: 
      type: "boolean"
      flags: 
        presence: "optional"
    isPaper: 
      type: "boolean"
      flags: 
        presence: "optional"
    judge: 
      type: "string"
      flags: 
        description: "The judge associated with the document."
      allow: 
        - null
      whens: 
        - 
          ref: 
            path: 
              - "documentType"
          is: 
            type: "string"
            flags: 
              only: true
            allow: 
              - "MOP - Memorandum Opinion"
              - "Summary Opinion"
              - "TCOP - T.C. Opinion"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
    lodged: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "A lodged document is awaiting action by the judge to enact or refuse."
    numberOfPages: 
      type: "number"
      flags: 
        presence: "optional"
      allow: 
        - null
    objections: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "No"
        - "Yes"
        - "Unknown"
    ordinalValue: 
      type: "string"
      flags: 
        presence: "optional"
    partyIrsPractitioner: 
      type: "boolean"
      flags: 
        presence: "optional"
    partyPrimary: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Use the primary contact to compose the filedBy text."
    partySecondary: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Use the secondary contact to compose the filedBy text."
    pending: 
      type: "boolean"
      flags: 
        presence: "optional"
    previousDocument: 
      type: "object"
      flags: 
        presence: "optional"
    privatePractitioners: 
      type: "array"
      flags: 
        presence: "optional"
        description: "Practitioner names to be used to compose the filedBy text."
      items: 
        - 
          type: "object"
          keys: 
            name: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "max"
                  args: 
                    limit: 500
    processingStatus: 
      type: "string"
      flags: 
        presence: "optional"
    qcAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    qcByUserId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      allow: 
        - null
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    relationship: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "primaryDocument"
        - "primarySupportingDocument"
        - "secondaryDocument"
        - "secondarySupportingDocument"
        - "supportingDocument"
    scenario: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "Standard"
        - "Nonstandard A"
        - "Nonstandard B"
        - "Nonstandard C"
        - "Nonstandard D"
        - "Nonstandard E"
        - "Nonstandard F"
        - "Nonstandard G"
        - "Nonstandard H"
        - "Type A"
        - "Type B"
        - "Type C"
        - "Type D"
        - "Type E"
        - "Type F"
        - "Type G"
        - "Type H"
    secondaryDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "A secondary date associated with the document, typically related to time-restricted availability."
    servedAt: 
      type: "alternatives"
      flags: 
        description: "When the document is served on the parties."
      matches: 
        - 
          ref: 
            path: 
              - "servedParties"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "date"
            flags: 
              format: 
                - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                - "YYYY-MM-DD"
              presence: "required"
          otherwise: 
            type: "date"
            flags: 
              format: 
                - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                - "YYYY-MM-DD"
              presence: "optional"
    servedParties: 
      type: "array"
      flags: 
        description: "The parties to whom the document has been served."
      whens: 
        - 
          ref: 
            path: 
              - "servedAt"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
      items: 
        - 
          type: "object"
          keys: 
            name: 
              type: "string"
              flags: 
                presence: "required"
              rules: 
                - 
                  name: "max"
                  args: 
                    limit: 500
    serviceDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "Certificate of service date."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      allow: 
        - null
    serviceStamp: 
      type: "string"
      flags: 
        presence: "optional"
    signedAt: 
      type: "string"
      flags: 
        description: "The time at which the document was signed."
      whens: 
        - 
          ref: 
            path: 
              - "draftState"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
          otherwise: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "documentType"
                is: 
                  type: "any"
                  flags: 
                    only: true
                  allow: 
                    - "Order"
                    - "Order of Dismissal for Lack of Jurisdiction"
                    - "Order of Dismissal"
                    - "Order of Dismissal and Decision"
                    - "Order to Show Cause"
                    - "Order and Decision"
                    - "Decision"
                    - "Notice"
                then: 
                  type: "any"
                  flags: 
                    presence: "required"
                otherwise: 
                  type: "any"
                  flags: 
                    presence: "optional"
                  allow: 
                    - null
    signedJudgeName: 
      type: "any"
      flags: 
        description: "The judge who signed the document."
      whens: 
        - 
          ref: 
            path: 
              - "draftState"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "string"
            flags: 
              presence: "optional"
            allow: 
              - null
          otherwise: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "documentType"
                is: 
                  type: "string"
                  flags: 
                    only: true
                  allow: 
                    - "Order"
                    - "Order of Dismissal for Lack of Jurisdiction"
                    - "Order of Dismissal"
                    - "Order of Dismissal and Decision"
                    - "Order to Show Cause"
                    - "Order and Decision"
                    - "Decision"
                    - "Notice"
                then: 
                  type: "string"
                  flags: 
                    presence: "required"
                otherwise: 
                  type: "string"
                  flags: 
                    presence: "optional"
                  allow: 
                    - null
    signedByUserId: 
      type: "any"
      flags: 
        description: "The id of the user who applied the signature."
      whens: 
        - 
          ref: 
            path: 
              - "signedJudgeName"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "guid"
                args: 
                  options: 
                    version: 
                      - "uuidv4"
          otherwise: 
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "guid"
                args: 
                  options: 
                    version: 
                      - "uuidv4"
            allow: 
              - null
    supportingDocument: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    trialLocation: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An optional trial location used when generating a fully concatenated document title."
      allow: 
        - null
    userId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    workItems: 
      type: "array"
      flags: 
        presence: "optional"

 ```
