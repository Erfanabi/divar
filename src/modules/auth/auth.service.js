const UserModel = require("../user/user.module");
const autoBind = require("auto-bind");

class AuthService {
  #model

  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  sendOTP(mobile) {
  }

  checkOTP(mobile, code) {
  }

  logout() {
  }
}

module.exports = new AuthService();