function User(rawUser) {
  this.name = rawUser.name;
}

User.prototype.isValid = function isValid() {
  return !!this.name;
};

export default User;
