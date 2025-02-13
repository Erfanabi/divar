// src/modules/auth/auth.routes.js

const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const Authorization = require("../../common/guard/authorization.quard");

// ارسال OTP
router.post('/send-otp', AuthController.sendOTP);

// تایید OTP
router.post('/check-otp', AuthController.checkOTP);

// خروج
router.get("/logout", Authorization, AuthController.logout);


module.exports = { AuthRouter: router };
