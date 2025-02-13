// src/modules/user/user.routes.js

const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const Authorization = require("../../common/guard/authorization.quard");

router.get("/info", Authorization, UserController.info);


module.exports = { UserRouter: router };
