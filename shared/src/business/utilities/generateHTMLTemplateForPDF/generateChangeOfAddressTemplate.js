const React = require('react');
const ReactDOM = require('react-dom/server');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

require('regenerator-runtime');
require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env'],
});
const ChangeOfAddress = require('../pdfGenerator/documentTemplates/ChangeOfAddress.jsx')
  .default;

/**
 * HTML template generator for printable change of address/telephone PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateChangeOfAddressTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    docketNumberWithSuffix,
    documentTitle,
    name,
    newData,
    oldData,
  } = content;

  const reactNoticeHTMLTemplate = ReactDOM.renderToString(
    React.createElement(ChangeOfAddress, {
      name,
      newData,
      oldData,
      options: {
        caption,
        docketNumberWithSuffix,
        h3: documentTitle,
        showAddressAndPhoneChange:
          documentTitle === 'Notice of Change of Address and Telephone Number',
        showOnlyPhoneChange:
          documentTitle === 'Notice of Change of Telephone Number',
      },
    }),
  );

  const htmlTemplate = generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactNoticeHTMLTemplate },
    options: {
      overwriteMain: true,
      title: 'Change of Contact Information',
    },
  });

  return htmlTemplate;
};

module.exports = {
  generateChangeOfAddressTemplate,
};
