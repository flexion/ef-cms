const {
  generateHTMLTemplateForPDF,
  getCompiledCSS,
} = require('../generateHTMLTemplateForPDF');
const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');

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
    content: reactOrderTemplate,
    options: {
      overwriteMain: true,
      title: orderTitle,
    },
  });

  const css = await getCompiledCSS({ applicationContext });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml: `<style>${css}</style>` + headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  order,
};
