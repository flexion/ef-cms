import { runAction } from 'cerebral/test';
import { updateCreateCaseMessageAttachmentsAction } from './updateCreateCaseMessageAttachmentsAction';

describe('updateCreateCaseMessageAttachmentsAction', () => {
  const caseDetail = {
    documents: [
      {
        documentId: '123',
        documentType: 'Petition',
      },
    ],
  };

  it('appends the given document meta from props to the form.modal.attachments array', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '123', documentTitle: 'Petition' },
    ]);
  });

  it('does not modify the array if no documentId is given', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '',
        documentTitle: '',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);
  });

  it('sets the form subject field if this is the first attachment to be added', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Petition');
  });

  it('does NOT set the form subject field if this is NOT the first attachment to be added', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}], // already contains one attachment
            subject: 'Testing',
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Testing');
  });
});
