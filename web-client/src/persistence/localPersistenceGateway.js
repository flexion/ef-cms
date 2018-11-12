import User from '../entities/User';

const filePdfPetition = async function filePdfPetition() {
  // user,
  // petition,
  // environment,
  // TODO: store documents in localStorage
  return;
};

const getUser = name => {
  if (name !== 'Test, Taxpayer') return undefined;
  return new User({ name: name });
};

const localPersistenceGateway = {
  filePdfPetition,
  getUser,
};

export default localPersistenceGateway;
