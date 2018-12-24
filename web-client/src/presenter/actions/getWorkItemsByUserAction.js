import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  let workItems = await useCases.getWorkItems({
    applicationContext,
    userId,
  });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return path.success({ workItems });
};
