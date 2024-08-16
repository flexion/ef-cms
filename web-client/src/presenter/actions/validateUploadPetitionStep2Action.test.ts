import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadPetitionStep2Action } from '@web-client/presenter/actions/validateUploadPetitionStep2Action';

describe('validateUploadPetitionStep2Action', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered for an autogenerated petition in step 1 passes validation', async () => {
    await runAction(validateUploadPetitionStep2Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep2Data: {
          petitionFacts: ['Fact goes here'],
          petitionReasons: ['Reason goes here'],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
      state: {
        form: {
          petitionFacts: ['Fact goes here'],
          petitionReasons: ['Reason goes here'],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the valid path when the data gathered for an user uploaded petition in step 1 passes validation', async () => {
    await runAction(validateUploadPetitionStep2Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep2Data: {
          petitionFacts: [''],
          petitionFile: {},
          petitionFileSize: 1,
          petitionReasons: [''],
          petitionRedactionAcknowledgement: true,
          petitionType: PETITION_TYPES.userUploaded,
        },
      },
      state: {
        form: {
          petitionFacts: [''],
          petitionFile: {},
          petitionFileSize: 1,
          petitionReasons: [''],
          petitionRedactionAcknowledgement: true,
          petitionType: PETITION_TYPES.userUploaded,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when facts or reasons are empty', async () => {
    await runAction(validateUploadPetitionStep2Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep2Data: {
          petitionFacts: [''],
          petitionReasons: [''],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
      state: {
        form: {
          petitionFacts: [''],
          petitionReasons: [''],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
