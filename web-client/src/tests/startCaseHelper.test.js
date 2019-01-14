import { runCompute } from 'cerebral/test';

import startCaseHelper from '../presenter/computeds/startCaseHelper';

describe('start a case computed', () => {
  it('sets showIrsNoticeFileValid false when the irsNoticeFile is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
        },
        form: {},
      },
    });
    expect(result.showIrsNoticeFileValid).toBeFalsy();
  });

  it('sets showIrsNoticeFileValid when the irsNoticeFile is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          irsNoticeFile: true,
        },
        form: {},
      },
    });
    expect(result.showIrsNoticeFileValid).toBeTruthy();
  });

  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {},
        form: {},
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
        },
        form: {},
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets uploadsFinished', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
          irsNoticeFile: true,
          uploadsFinished: 1,
        },
        form: {},
      },
    });
    expect(result.uploadsFinished).toEqual(1);
  });

  it('sets uploadPercentage for partial completion', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
          irsNoticeFile: true,
          uploadsFinished: 1,
        },
        form: {},
      },
    });
    expect(result.uploadPercentage).toEqual(50);
  });

  it('sets uploadPercentage for full completion', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
          irsNoticeFile: true,
          uploadsFinished: 2,
        },
        form: {},
      },
    });
    expect(result.uploadPercentage).toEqual(100);
  });
});
