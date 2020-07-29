const { upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (
    item.pk.startsWith('user-outbox|') ||
    item.pk.startsWith('section-outbox')
  ) {
    return {
      ...item,
      sk: item.completedAt,
    };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
