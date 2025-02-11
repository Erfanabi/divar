// src/modules/auth/auth.routes.js

const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');

// ارسال OTP
router.post('/send-otp', AuthController.sendOTP);

// تایید OTP
router.post('/check-otp', AuthController.checkOTP);

module.exports = { AuthRouter: router };
