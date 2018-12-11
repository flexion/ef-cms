/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);

  //petitioner
  if (this.userId === 'taxpayer') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Taxpayer';
    }
    if (!this.role) {
      this.role = 'taxpayer';
    }
    if (!this.token) {
      this.token = 'taxpayer';
    }
  }
  //petitionsclerk
  else if (this.userId === 'petitionsclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Petitionsclerk';
    }
    if (!this.role) {
      this.role = 'petitionsclerk';
    }
    if (!this.token) {
      this.token = 'petitionsclerk';
    }
  } else if (this.userId === 'intakeclerk') {
    if (!this.firstName) {
      this.firstName = 'Test';
    }
    if (!this.lastName) {
      this.lastName = 'Intakeclerk';
    }
    if (!this.role) {
      this.role = 'intakeclerk';
    }
    if (!this.token) {
      this.token = 'intakeclerk';
    }
    if (!this.userId) {
      this.userId = 'intakeclerk';
    }
  } else if (this.userId === 'respondent') {
    if (!this.firstName) {
      this.firstName = 'IRS';
    }
    if (!this.lastName) {
      this.lastName = 'Attorney';
    }
    if (!this.middleName) {
      this.middleName = 'James';
    }
    if (!this.title) {
      this.title = 'Mr';
    }
    if (!this.role) {
      this.role = 'respondent';
    }
    if (!this.barNumber) {
      this.barNumber = '12345';
    }
    if (!this.token) {
      this.token = 'respondent';
    }
    if (!this.userId) {
      this.userId = 'respondent';
    }
    if (!this.email) {
      this.email = 'respondent@exampe.com';
    }
    if (!this.address) {
      this.address = '1341 Mesa Drive, Las Vegas, NV, 89119';
    }
    if (!this.isIRSAttorney) {
      this.isIRSAttorney = true;
    }
    if (!this.phone) {
      this.phone = '111-111-1111';
    }
  } else {
    throw new Error('invalid user');
  }
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

module.exports = User;
