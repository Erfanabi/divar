const authService = require('./auth.service');
const autoBind = require('auto-bind');
const NodeEnv = require("../../common/constant/env.enum");

class AuthController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = authService;
  }

  // متد ارسال OTP
  async sendOTP(req, res, next) {
    const { mobile } = req.body; // دریافت شماره موبایل از درخواست

    // بررسی که آیا شماره موبایل ارسال شده یا خیر
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
      // فراخوانی متد sendOTP از AuthService
      const response = await this.#service.sendOTP(mobile);
      res.status(200).json(response); // ارسال پاسخ موفقیت‌آمیز
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  // متد تایید OTP
  async checkOTP(req, res, next) {
    const { mobile, otp } = req.body; // دریافت شماره موبایل و کد OTP از درخواست

    // بررسی که آیا شماره موبایل و کد OTP ارسال شده یا خیر
    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile and OTP are required' });
    }

    try {
      // فراخوانی متد checkOTP از AuthService
      const response = await this.#service.checkOTP(mobile, otp);

      // ذخیره توکن در کوکی
      res.cookie('access_token', response.token, {
        httpOnly: true, // از دسترسی جاوااسکریپت به کوکی جلوگیری می‌کند
        secure: process.env.NODE_ENV === NodeEnv.Production, // در صورت استفاده از HTTPS، فقط در این حالت توکن در کوکی ذخیره می‌شود
        maxAge: 3600000, // تنظیم زمان انقضای کوکی (مثلاً یک ساعت)
      });

      res.status(200).json(response); // ارسال پاسخ موفقیت‌آمیز
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  logout(req, res, next) {
    const user = req.user;

    try {
      res.status(200).json({
        message: 'Welcome to your profile',
        user: user // ارسال اطلاعات کاربر به کاربر
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();