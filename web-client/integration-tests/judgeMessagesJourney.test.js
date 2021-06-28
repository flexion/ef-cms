import { judgeViewsCaseDetail } from './journey/judgeViewsCaseDetail';
import { judgeViewsDashboardMessages } from './journey/judgeViewsDashboardMessages';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userSendsMessageToJudge } from './journey/userSendsMessageToJudge';

const integrationTest = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  const message1Subject = `message 1 ${Date.now()}`;
  const message2Subject = `message 2 ${Date.now()}`;

  loginAs(integrationTest, 'petitionsclerk@example.com');
  userSendsMessageToJudge(integrationTest, message1Subject);

  loginAs(integrationTest, 'docketclerk@example.com');
  userSendsMessageToJudge(integrationTest, message2Subject);

  loginAs(integrationTest, 'judgeColvin@example.com');
  judgeViewsDashboardMessages(integrationTest, [
    message1Subject,
    message2Subject,
  ]);
  judgeViewsCaseDetail(integrationTest);
});
