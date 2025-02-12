const UserModel = require("../user/user.module");
const autoBind = require("auto-bind");

class AuthService {
  #model

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

      return { message: 'OTP sent successfully to mobile' };
    } catch (error) {
      throw new Error('Error in sending OTP: ' + error.message);
    }
  }

  checkOTP(mobile, code) {
  }

  logout() {
  }
}

module.exports = new AuthService();