const authService = require('./auth.service');
const autoBind = require('auto-bind');

class AuthController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = authService;
  }

  sendOTP(req, res, next) {
    try {

    } catch (error) {
      next(error);
    }
  }

  checkOTP(req, res, next) {
    try {

    } catch (error) {
      next(error);
    }
  }

  logout(req, res, next) {
    try {

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();