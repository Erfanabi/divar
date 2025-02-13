const authService = require('./auth.service');
const autoBind = require('auto-bind');
const NodeEnv = require("../../common/constant/env.enum");
const CookieNames = require("../../common/constant/cookie.enum");

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
      res.cookie(CookieNames.AccessToken, response.token, {
        httpOnly: true, // از دسترسی جاوااسکریپت به کوکی جلوگیری می‌کند
        secure: process.env.NODE_ENV === NodeEnv.Production, // در صورت استفاده از HTTPS، فقط در این حالت توکن در کوکی ذخیره می‌شود
        maxAge: 3600000, // تنظیم زمان انقضای کوکی (مثلاً یک ساعت)
      });

      res.status(200).json(response); // ارسال پاسخ موفقیت‌آمیز
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  // متد خروج از سیستم
  async logout(req, res, next) {
    try {
      // حذف کوکی از مرورگر کاربر
      res.clearCookie(CookieNames.AccessToken, {
        httpOnly: true, // جلوگیری از دسترسی جاوااسکریپت
        secure: process.env.NODE_ENV === 'production', // در صورتی که از HTTPS استفاده می‌کنید
        sameSite: 'Strict', // محافظت از کوکی در برابر حملات CSRF
      });

      // در صورتی که توکن هم در پایگاه داده ذخیره شده باشد، آن را پاک کنید
      const userId = req.user._id; // فرض بر این است که اطلاعات کاربر از قبل در req.user ذخیره شده
      const response = await this.#service.logout(userId); // فراخوانی متد logout از AuthService

      res.status(200).json(response); // ارسال پیام خروج موفق
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }
}

module.exports = new AuthController();