const assert = require('assert');

const User = require('./User');

describe('User entity', () => {
  it('Assigns the expected petitions section to the user', () => {
    const user = new User({
      userId: 'petitionsclerk',
    });
    expect(user.section).toEqual('petitions');
  });

  it('Assigns the expected docket section to the user', () => {
    const user = new User({
      userId: 'docketclerk',
    });
    expect(user.section).toEqual('docket');
  });

  it('Assigns the expected seniorattorney section to the user', () => {
    const user = new User({
      userId: 'seniorattorney',
    });
    expect(user.section).toEqual('seniorattorney');
  });

  it('Creates a valid taxpayer user', () => {
    const user = new User({
      userId: 'taxpayer',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Generates valid docket record names', () => {
    let user = new User({
      userId: 'taxpayer',
      role: 'petitioner',
    });
    assert.ok(user.isValid());
    expect(user.getDocketRecordName()).toEqual('Petitioner Test Taxpayer');
    user = new User({
      userId: 'intakeclerk',
    });
    assert.ok(user.isValid());
    expect(user.getDocketRecordName()).toEqual('Test Intakeclerk');
  });

  it('Creates a valid petitioner user', () => {
    const user = new User({
      userId: 'petitioner',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid petitionsclerk user', () => {
    const user = new User({
      userId: 'petitionsclerk',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid petitionsclerk user for 0-99 clerks', () => {
    for (var i = 0; i < 100; i++) {
      const user = new User({
        userId: 'petitionsclerk' + i,
        role: 'Tester',
        firstName: 'firstName',
        lastName: 'lastName',
      });
      assert.ok(user.isValid());
    }
  });

  it('Creates a valid docketclerk user for 0-99 clerks', () => {
    for (var i = 0; i < 100; i++) {
      const user = new User({
        userId: 'docketclerk' + i,
        role: 'Tester',
        firstName: 'firstName',
        lastName: 'lastName',
      });
      assert.ok(user.isValid());
    }
  });

  it('does not Creates a valid petitionsclerk user for more than 99 clerks', () => {
    for (var i = 100; i < 4000; i = i + 999) {
      let error;
      try {
        new User({
          userId: 'petitionsclerk' + i,
          role: 'Tester',
          firstName: 'firstName',
          lastName: 'lastName',
        });
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    }
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      firstName: 'firstName',
      lastName: 'bob',
      role: 'Tester',
      barNumber: 'gg',
      token: 'abc',
      userId: 'respondent',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      userId: 'respondent',
    });
    assert.ok(user.isValid());
  });

  it('Creates a valid respondent user', () => {
    const user = new User({
      userId: 'intakeclerk',
      role: 'Tester',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    assert.ok(user.isValid());
  });

  it('Creates an invalid user', () => {
    let error = null;
    try {
      new User({
        userId: '',
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });
});
