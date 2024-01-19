import { combineTwoPdfs } from './combineTwoPdfs';
import { generatePageMetaHeaderDocket } from './generatePageMetaHeaderDocket';
import { headerFontFace } from './headerFontFace';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

chromium.setGraphicsMode = false;

export const generatePdfFromHtmlHelper = async ({
  contentHtml,
  displayHeaderFooter = true,
  docketNumber,
  footerHtml,
  headerHtml,
  overwriteFooter,
}: {
  contentHtml: string;
  displayHeaderFooter: boolean;
  docketNumber?: string;
  footerHtml?: string;
  headerHtml?: string;
  overwriteFooter?: boolean;
}) => {
  let browser: any | undefined;
  let result: any = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    let page = await browser?.newPage()!;

    await page.setContent(contentHtml);

    if (headerHtml === undefined) {
      headerHtml = generatePageMetaHeaderDocket({
        data: {
          docketNumber,
        },
      });
    }

    const headerTemplate = `
          <div style="font-size: 8px; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${headerHtml}
          </div>
    `;

    const footerTemplate = overwriteFooter
      ? `${footerHtml || ''}`
      : `
          <div class="footer-default" style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${footerHtml || ''}
          </div>`;

    const firstPage = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate,
      format: 'Letter',
      margin: {
        bottom: '100px',
        top: '80px',
      },
      pageRanges: '1',
      printBackground: true,
    });

    let remainingPages: any;
    try {
      remainingPages = await page.pdf({
        displayHeaderFooter,
        footerTemplate,
        format: 'Letter',
        headerTemplate: `<style>${headerFontFace}</style>${headerTemplate}`,
        margin: {
          bottom: '100px',
          top: '80px',
        },
        pageRanges: '2-',
        printBackground: true,
      });
    } catch (err) {
      // this was probably a 1 page document
      const error = err as Error;
      if (!error.message.includes('Page range exceeds page count')) {
        throw err;
      }
    }

    if (remainingPages) {
      const returnVal = await combineTwoPdfs({
        firstPdf: firstPage,
        secondPdf: remainingPages,
      });
      result = Buffer.from(returnVal);
    } else {
      result = firstPage;
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }

  return result;
};
