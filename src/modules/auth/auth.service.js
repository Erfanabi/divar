const autoBind = require("auto-bind");
const jwt = require('jsonwebtoken');
const UserModel = require("../user/user.model");
const { AuthMessage } = require("./auth.message");

class AuthService {
  #model
  #secret = process.env.JWT_SECRET_KEY;

  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  // ارسال OTP به موبایل
  async sendOTP(mobile) {
    try {
      // بررسی اینکه آیا کاربری با این موبایل در پایگاه داده وجود دارد
      let user = await this.#model.findOne({ mobile });

      // اگر کاربری وجود ندارد، یک کاربر جدید می‌سازیم
      if (!user) {
        user = new this.#model({ mobile });
        await user.save();  // ذخیره کاربر جدید
      }

      // تولید کد OTP (کد 6 رقمی تصادفی)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // تنظیم زمان انقضای OTP (5 دقیقه بعد از ارسال)
      const expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + 5);

      // console.log(expireTime.toLocaleTimeString());

      // ذخیره کد OTP و زمان انقضا در پایگاه داده
      user.otp = { code: otpCode, expireIn: expireTime };
      await user.save();

      // ارسال OTP به موبایل کاربر
      // await sendOtpToMobile(mobile, otpCode); // فرض بر این است که sendOtpToMobile ارسال پیامک را انجام می‌دهد

      return { message: AuthMessage.SendOtpSuccessfully };
    } catch (error) {
      throw new Error('Error in sending OTP: ' + error.message);
    }
  }

// تایید OTP
  async checkOTP(mobile, code) {
    try {
      // پیدا کردن کاربر با استفاده از موبایل
      const user = await this.#model.findOne({ mobile });

      if (!user) {
        throw new Error(AuthMessage.NotFound);
      }

      // بررسی اینکه آیا OTP منقضی نشده باشد
      if (new Date() > new Date(user.otp.expireIn)) {
        throw new Error(AuthMessage.OtpCodeExpired);
      }

      // بررسی اینکه کد وارد شده با کد ذخیره شده برابر باشد
      if (user.otp.code !== code) {
        throw new Error(AuthMessage.OtpCodeIsIncorrect);
      }

      // تولید توکن
      const token = this.signToken({ userId: user._id, mobile: user.mobile });

      // تایید شماره موبایل و حذف OTP پس از تایید
      user.verifiedMobile = true;
      user.otp = null; // حذف OTP بعد از تایید
      user.accessToken = token

      await user.save();

      return { message: AuthMessage.LoginSuccessfully, token, user };
    } catch (error) {
      throw new Error('Error in checking OTP: ' + error.message);
    }
  }

  // خروج از سیستم (حذف توکن‌ها یا اطلاعات نشست)
  async logout(userId) {
    try {
      const user = await this.#model.findById(userId);
      if (!user) {
        throw new Error(AuthMessage.NotFound);
      }

      // فرض کنید که توکن یا اطلاعات نشست را پاک می‌کنیم
      user.accessToken = null; // یا هر روش دیگری برای مدیریت نشست یا توکن
      await user.save();

      return { message: AuthMessage.LogoutSuccessfully };
    } catch (error) {
      throw new Error('Error in logging out: ' + error.message);
    }
  }

  signToken(payload) {
    return jwt.sign(payload, this.#secret, { expiresIn: "1y" });
  };

  verifyToken(token) {
    return jwt.verify(token, this.#secret);
  };
}

module.exports = new AuthService();