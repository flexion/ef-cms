const {
  reactTemplateGenerator,
} = require('./generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

const {
  generateChangeOfAddressTemplate,
} = require('./generateHTMLTemplateForPDF/generateChangeOfAddressTemplate');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generateHTMLTemplateForPDF/generatePrintableDocketRecordTemplate');

const addressLabelCoverSheet = async ({ applicationContext, data }) => {
  const addressLabelCoverSheetTemplate = reactTemplateGenerator({
    componentName: 'AddressLabelCoverSheet',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: addressLabelCoverSheetTemplate },
    options: {
      overwriteMain: true,
      title: '',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      overwriteHeader: true,
    });

  return pdf;
};

const changeOfAddress = async ({ applicationContext, content }) => {
  const pdfContentHtml = await generateChangeOfAddressTemplate({
    applicationContext,
    content,
  });

  const { docketNumber } = content;

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const coverSheet = async ({ applicationContext, data }) => {
  const coverSheetTemplate = reactTemplateGenerator({
    componentName: 'CoverSheet',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: coverSheetTemplate },
    options: {
      overwriteMain: true,
      title: 'Cover Sheet',
    },
  });

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = reactTemplateGenerator({
      componentName: 'DateServedFooter',
      data: {
        dateServed: data.dateServed,
      },
    });
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
      overwriteHeader: true,
    });

  return pdf;
};

const docketRecord = async ({ applicationContext, data }) => {
  const pdfContentHtml = await generatePrintableDocketRecordTemplate({
    applicationContext,
    data,
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: data.docketNumberWithSuffix,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YYYY'),
    },
  });

  const docketNumber = data.caseDetail.docketNumberWithSuffix;

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const noticeOfDocketChange = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumberWithSuffix,
    filingParties,
    filingsAndProceedings,
  } = data;

  const NoticeOfDocketChangeTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfDocketChange',
    data: {
      docketEntryIndex,
      filingParties,
      filingsAndProceedings,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: NoticeOfDocketChangeTemplate },
    options: {
      overwriteMain: true,
      title: 'Notice of Docket Change',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};

const noticeOfReceiptOfPetition = async ({ applicationContext, data }) => {
  const reactNoticeReceiptPetitionTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfReceiptOfPetition',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactNoticeReceiptPetitionTemplate },
    options: {
      overwriteMain: true,
      title: 'Notice of Receipt of Petition',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: data.docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      headerHtml,
    });

  return pdf;
};

const order = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    orderContent,
    orderTitle,
    signatureText,
  } = data;

  const reactOrderTemplate = reactTemplateGenerator({
    componentName: 'Order',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      orderContent,
      orderTitle,
      signatureText,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactOrderTemplate },
    options: {
      overwriteMain: true,
      title: orderTitle,
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const pendingReport = async ({ applicationContext, data }) => {
  const { pendingItems, subtitle } = data;

  const pendingReportTemplate = reactTemplateGenerator({
    componentName: 'PendingReport',
    data: {
      pendingItems,
      subtitle,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: pendingReportTemplate },
    options: {
      overwriteMain: true,
      title: 'Pending Report',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Pending Report: ${subtitle}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YYYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const receiptOfFiling = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    document,
    filedAt,
    filedBy,
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
  } = data;

  const reactReceiptOfFilingTemplate = reactTemplateGenerator({
    componentName: 'ReceiptOfFiling',
    data: {
      document,
      filedAt,
      filedBy,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      secondaryDocument,
      secondarySupportingDocuments,
      supportingDocuments,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactReceiptOfFilingTemplate },
    options: {
      overwriteMain: true,
      title: 'Receipt of Filing',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const standingPretrialNotice = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    footerDate,
    trialInfo,
  } = data;

  const reactStandingPretrialNoticeTemplate = reactTemplateGenerator({
    componentName: 'StandingPretrialNotice',
    data: {
      footerDate,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactStandingPretrialNoticeTemplate },
    options: {
      overwriteMain: true,
      title: 'Standing Pre-trial Order',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const standingPretrialOrder = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    footerDate,
    trialInfo,
  } = data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'StandingPretrialOrder',
    data: {
      footerDate,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactStandingPretrialOrderTemplate },
    options: {
      overwriteMain: true,
      title: 'Standing Pre-trial Order',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const caseInventoryReport = async ({ applicationContext, data }) => {
  const {
    formattedCases,
    reportTitle,
    showJudgeColumn,
    showStatusColumn,
  } = data;

  const caseInventoryReportTemplate = reactTemplateGenerator({
    componentName: 'CaseInventoryReport',
    data: {
      formattedCases,
      reportTitle,
      showJudgeColumn,
      showStatusColumn,
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Case Inventory Report: ${reportTitle}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YYYY'),
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: caseInventoryReportTemplate },
    options: {
      overwriteMain: true,
      title: 'Case Inventory Report',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const trialCalendar = async ({ applicationContext, data }) => {
  const { cases, sessionDetail } = data;

  const trialCalendarTemplate = reactTemplateGenerator({
    componentName: 'TrialCalendar',
    data: {
      cases,
      sessionDetail,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: trialCalendarTemplate },
    options: {
      overwriteMain: true,
      title: 'Trial Calendar',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Trial Calendar: ${sessionDetail.trialLocation} - ${sessionDetail.startDate} ${sessionDetail.sessionType}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YYYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const trialSessionPlanningReport = async ({ applicationContext, data }) => {
  const { locationData, previousTerms, term } = data;

  const trialSessionPlanningReportTemplate = reactTemplateGenerator({
    componentName: 'TrialSessionPlanningReport',
    data: {
      locationData,
      previousTerms,
      term,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: trialSessionPlanningReportTemplate },
    options: {
      overwriteMain: true,
      title: 'Trial Session Planning Report',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Trial Session Planning Report: ${term}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YYYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  addressLabelCoverSheet,
  caseInventoryReport,
  changeOfAddress,
  coverSheet,
  docketRecord,
  noticeOfDocketChange,
  noticeOfReceiptOfPetition,
  order,
  pendingReport,
  receiptOfFiling,
  standingPretrialNotice,
  standingPretrialOrder,
  trialCalendar,
  trialSessionPlanningReport,
};
