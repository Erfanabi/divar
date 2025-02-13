const autoBind = require("auto-bind");
const UserModel = require("./user.model");

class UserService {
  #model
  #secret = process.env.JWT_SECRET_KEY;

  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }
}

module.exports = new UserService();