import { toMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';

expect.extend({ toMatchImageSnapshot });

describe('Petitions clerk', () => {
  let browser;
  let page;
  const snapshotOptions = {
    blur: 1,
    failureThreshold: 0.1,
    failureThresholdType: 'percent',
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setViewport({ deviceScaleFactor: 0.7, height: 1000, width: 1350 });
  });

  afterAll(async () => {
    await browser.close();
  });

  it('dashboard', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('create case from paper', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('case detail', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('case detail case info tab', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-case-info');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('document details', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('document details messages tab', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-pending-messages');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('document details case info tab', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-case-info');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('document details IRS notice tab', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-irs-notice');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('document details create message modal', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-pending-messages');
    await page.click('#create-message-button');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('edit case caption modal', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#caption-edit-button');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('trial sessions', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-sessions',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('add trial session form', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/add-a-trial-session&info=add-trial-session',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('create order modal', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#button-create-order');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('edit signed order confirm modal', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#tab-draft-documents');
    await page.click(
      'button[data-document-id="25100ec6-eeeb-4e88-872f-c99fad1fe6c7"]',
    );
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('sign order', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/edit-order/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/sign',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('add case deadline modal', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.click('#button-add-deadline');
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('orders needed summary', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/orders-needed',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });

  it('all case deadlines report', async () => {
    await page.goto(
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/reports/case-deadlines',
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot(snapshotOptions);
  });
});
