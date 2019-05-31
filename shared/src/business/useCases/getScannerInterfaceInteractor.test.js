const { getScannerInterface } = require('./getScannerInterfaceInteractor');
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('');
global.window = jsdom.window;

const mockSources = ['Test Source 1', 'Test Source 2'];
const mockScanCount = 1;

const DWObject = {
  AcquireImage: () => null,
  CloseSource: () => null,
  ConvertToBlob: (
    indices,
    enumImageType,
    asyncSuccessFunc,
    asyncFailureFunc,
  ) => {
    const args = [indices, enumImageType, asyncSuccessFunc, asyncFailureFunc];
    return asyncSuccessFunc(args);
  },
  DataSource: null,
  DataSourceStatus: 0,
  ErrorCode: 0,
  ErrorString: 'Successful!',
  GetSourceNameItems: index => mockSources[index],
  HowManyImagesInBuffer: mockScanCount,
  OpenSource: () => null,
  RemoveAllImages: () => null,
  SelectSourceByIndex: idx => {
    DWObject.DataSource = idx;
    return true;
  },
  SourceCount: mockSources.length,
};

const Dynamsoft = {
  WebTwainEnv: {
    GetWebTwain: () => DWObject,
  },
};

describe('getScannerInterface', () => {
  beforeEach(() => {
    window.Dynamsoft = { ...Dynamsoft };
  });

  it('returns the TWAIN driver API', () => {
    const scannerAPI = getScannerInterface();
    expect(scannerAPI).toHaveProperty('DWObject');
  });

  // TODO: Beef this up
  it('has a method for completing the scan process', () => {
    const scannerAPI = getScannerInterface();
    expect(scannerAPI).toHaveProperty('completeScanSession');
  });

  it('can get the page / scan count in the current buffer', () => {
    const scannerAPI = getScannerInterface();
    expect(scannerAPI.getScanCount()).toEqual(mockScanCount);
  });

  it('can get an array of available scanner sources', () => {
    const scannerAPI = getScannerInterface();
    const sources = scannerAPI.getSources();
    expect(sources).toHaveLength(mockSources.length);
  });

  it('can get current scan errors', () => {
    const scannerAPI = getScannerInterface();
    const errorObj = scannerAPI.getScanError();
    expect(errorObj).toHaveProperty('code');
    expect(errorObj).toHaveProperty('message');
  });

  it('can get a data source status', () => {
    const scannerAPI = getScannerInterface();
    expect(scannerAPI.getSourceStatus()).toEqual(0);
  });

  it('can set a scanner source by index', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setSourceByIndex(1);
    expect(scannerAPI.DWObject.DataSource).toEqual(1);
  });

  it('can set a scanner source by name', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setSourceByName(mockSources[0]);
    expect(scannerAPI.DWObject.DataSource).toEqual(0);
  });

  // TODO: Beef this up
  it('has a method for starting the scan process', () => {
    const scannerAPI = getScannerInterface();
    expect(scannerAPI).toHaveProperty('startScanSession');
  });
});
