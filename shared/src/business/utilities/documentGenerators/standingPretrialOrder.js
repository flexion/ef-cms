const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const standingPretrialOrder = async ({ applicationContext, data }) => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'StandingPretrialOrder',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtmlWithHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactStandingPretrialOrderTemplate,
    options: {
      overwriteMain: true,
      title: 'Standing Pretrial Order',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdfWithHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithHeader,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  const reactGettingReadyForTrialChecklistTemplate = reactTemplateGenerator({
    componentName: 'GettingReadyForTrialChecklist',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtmlWithoutHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactGettingReadyForTrialChecklistTemplate,
  });

  const pdfWithoutHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithoutHeader,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
      overwriteHeader: false,
    });

  const orderAndChecklist = await combineTwoPdfs({
    applicationContext,
    firstPdf: pdfWithHeader,
    secondPdf: pdfWithoutHeader,
  });

  const pretrialMemorandumTemplate = reactTemplateGenerator({
    componentName: 'PretrialMemorandum',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const memorandumHtmlWithoutHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: pretrialMemorandumTemplate,
  });

  const memorandumPdfWithoutHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: memorandumHtmlWithoutHeader,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
      overwriteHeader: false,
    });

  return await combineTwoPdfs({
    applicationContext,
    firstPdf: orderAndChecklist,
    secondPdf: memorandumPdfWithoutHeader,
  });
};

module.exports = {
  standingPretrialOrder,
};
