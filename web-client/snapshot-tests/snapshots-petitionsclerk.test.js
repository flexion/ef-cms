import { toMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';

expect.extend({ toMatchImageSnapshot });

describe('Petitions clerk snapshots', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setViewport({ height: 1350, width: 1350 });
  });

  afterAll(async () => {
    await browser.close();
  });

  it('renders petitions clerk dashboard correctly', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });

  it('renders petitions clerk create case from paper correctly', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});
