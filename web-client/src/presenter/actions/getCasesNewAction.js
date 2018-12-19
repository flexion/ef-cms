import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  let caseList = await useCases.getCasesByStatus({
    applicationContext,
    userId: get(state.user.token),
    status: 'new',
  });
  caseList = _.orderBy(caseList, 'createdAt', 'asc');
  return path.success({ caseList });
};
