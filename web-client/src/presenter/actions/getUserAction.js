import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  try {
    const user = await useCases.getUser(get(state.form.name));
    return path.success({ user });
  } catch (err) {
    return path.error({
      alertError: {
        title: 'User not found',
        message: 'Username or password are incorrect',
      },
    });
  }
};
