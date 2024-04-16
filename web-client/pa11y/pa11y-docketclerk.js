const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'docketclerk@example.com' })],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/document-qc/section/inbox',
      'wait for td.message-select-control .usa-checkbox>label to be visible',
      'click element td.message-select-control .usa-checkbox>label',
      'wait for .action-section to be visible',
    ],
    notes: 'checks a11y of section queue tab panel',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/320-21/documents/6b2bcbcc-bc95-4103-b5fd-3e999395c2d3/edit',
      'wait for .modal-screen to be visible',
    ],
    notes: 'verify the work item already completed modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/edit-details',
      'wait for element .usa-radio__label[for=payment-status-paid] to be visible',
      'click element .usa-radio__label[for=payment-status-paid]',
      'wait for element #petition-payment-method to be visible',
    ],
    notes:
      'checks a11y of form when petition fee payment status paid is selected',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/edit-details',
      'wait for element .usa-radio__label[for=payment-status-unpaid] to be visible',
      'click element .usa-radio__label[for=payment-status-unpaid]',
      'wait for element #petition-payment-method to be removed',
    ],
    notes:
      'checks a11y of form when petition fee payment status unpaid is selected',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/edit-details',
      'wait for element .usa-radio__label[for=payment-status-waived] to be visible',
      'click element .usa-radio__label[for=payment-status-waived]',
      'wait for element #payment-date-waived-picker to be visible',
    ],
    notes:
      'checks a11y of form when petition fee payment status waived is selected',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19/documents/dc2664a1-f552-418f-bcc7-8a67f4246568/edit',
      'wait for #has-other-filing-party-label to be visible',
      'click element label#has-other-filing-party-label',
      'wait for input#other-filing-party to be visible',
    ],
    notes: 'checks a11y of edit docket entry add other filing party',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/reports/pending-report',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/reports/case-inventory-report',
      'wait for element .case-inventory-report-modal to be visible',
      'wait for #select-case-inventory-status to be visible',
      'set field #select-case-inventory-status to New',
      'check field #select-case-inventory-status',
      'wait for #select-case-inventory-judge to be visible',
      'set field #select-case-inventory-judge to Chief Judge',
      'check field #select-case-inventory-judge',
      'click element .modal-button-confirm',
      'wait for element table.case-inventory to be visible',
    ],
    notes: 'checks a11y of case inventory report builder',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19/add-paper-filing',
      'wait for element #certificate-of-service-label to be visible',
      'click element #certificate-of-service-label',
      'wait for element #service-date-picker to be visible',
    ],
    notes: 'reveal all secondary drop-downs and inputs ',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19&info=case-context-edit',
      'wait for #tab-case-information to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #tab-case-information',
      'wait for #menu-edit-case-context-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-edit-case-context-button',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks a11y of case context edit dialog',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-22',
      'wait for #tab-case-information to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #tab-case-information',
      'wait for #tab-history to be visible',
      'click element #tab-history',
      'wait for .case-status-history to be visible',
    ],
    notes: 'checks a11y on the case status history table',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/999-15',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #participants-and-counsel to be visible',
      'click element #participants-and-counsel',
      'wait for .edit-participant to be visible',
      'click element .edit-participant',
    ],
    notes:
      'checks a11y of case information tab, parties secondary tab, participants and counsel tertiary tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/999-15',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #petitioners-and-counsel to be visible',
      'click element #petitioners-and-counsel',
      'wait for .edit-petitioner-button to be visible',
      'click element .edit-petitioner-button',
    ],
    notes:
      'checks a11y of case information tab, parties secondary tab, parties and counsel tertiary tab',
    url: 'http://localhost:1234',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/110-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
    ],
    url: 'http://localhost:1234',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/107-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
      'wait for #judge to be visible',
      'set field #judge to Colvin',
      'check field #judge',
      'set field #free-text to Anything',
      'wait for #serve-to-parties-btn to be visible',
      'click element #serve-to-parties-btn',
      'wait for .confirm-initiate-service-modal to be visible',
    ],
    notes: 'checks a11y of confirm-initiate-service-modal dialog',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/111-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
      'wait for element #document-type to be visible',
      'set field #free-text to Anything',
      'check field #free-text',
      'set field #date-received-picker to 01/01/2022',
      'check field #date-received-picker',
      'wait for #save-entry-button to be visible',
      'click element #save-entry-button',
      'wait for .confirm-initiate-save-modal to be visible',
    ],
    notes: 'checks a11y of confirm-initiate-save-modal dialog',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to dismissal',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'set field #startDate-date-start to 08/03/2001',
      'check field #startDate-date-start',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #tab-opinion to be visible',
      'click element #tab-opinion',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to opinion',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'set field #startDate-date-start to 08/03/2001',
      'check field #startDate-date-start',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced opinion search',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to meow',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'set field #startDate-date-start to 08/03/2001',
      'check field #startDate-date-start',
      'click element button#advanced-search-button',
      'wait for svg.iconSealed to be visible',
    ],
    notes: 'checks a11y of advanced order search of a sealed case',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #tab-order to be visible',
      'click element #tab-opinion',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to sunglasses',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'set field #startDate-date-start to 08/03/2001',
      'check field #startDate-date-start',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of opinion search',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/print-preview/110-19',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/reports/case-deadlines',
      'wait for #deadlineStart-date-start to be visible',
      'set field #deadlineStart-date-start to 01/01/2019',
      'check field #deadlineStart-date-start',
      'set field #deadlineEnd-date-end to 12/01/2019',
      'check field #deadlineEnd-date-end',
      'click element button#update-date-range-deadlines-button',
      'wait for table.deadlines to be visible',
    ],
    notes: 'checks a11y of case deadline report',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-20/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-20/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416',
      'wait for #remove-petitioner-btn to be visible',
      'click element #remove-petitioner-btn',
      'wait for #remove-petitioner-modal to be visible',
    ],
    notes: 'checks a11y of remove petitioner confirm modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19?openModal=PaperServiceConfirmModal',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/111-19?openModal=UnconsolidateCasesModal',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-20/upload-court-issued',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-20/edit-upload-court-issued/b1aa4aa2-c214-424c-8870-d0049c5744d8',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20/document-view?docketEntryId=af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19/document-view?docketEntryId=f1aa4aa2-c214-424c-8870-d0049c5744d7&info=document-view-serve-button',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/messages/104-19/message-detail/2d1191d3-4597-454a-a2b2-84e267ccf01e',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20/add-petitioner-to-case',
      'wait for #use-same-address-above-label to be visible',
      'click element #use-same-address-above-label',
    ],
    notes: 'checks the add petitioner to case page',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20',
      'wait for #docket-record-table to be visible',
      'click element button[data-testid="seal-docket-entry-button-1"]',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the seal modal opens on a docket entry',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/maintenance',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/111-19',
      'wait for #docket-record-table to be visible',
      'wait for button[data-testid="document-viewer-link-A"] to be visible',
      'click element button[data-testid="document-viewer-link-A"]',
      'click element button[data-testid="serve-paper-filed-document"]',
      'wait for .modal-dialog to be visible',
    ],
    notes:
      'checks a11y of ConfirmInitiatePaperFilingServiceModal on paper filing for a consolidated group',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'docketclerk@example.com' }),
      'navigate to http://localhost:1234/reports/custom-case',
      'wait for table#custom-case-report-table to be visible',
      'set field #caseCreationStartDate-date-start to 04/19/1980',
      'set field #caseCreationEndDate-date-end to 04/19/2023',
      'click element #run-custom-case-report',
      'wait for #custom-case-report-table-body to be visible',
    ],
    notes: 'checks a11y of Custom Case Inventory Report',
    url: 'http://localhost:1234/',
  },
];
