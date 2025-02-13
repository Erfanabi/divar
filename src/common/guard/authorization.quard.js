const jwt = require('jsonwebtoken');
const UserModel = require("../../modules/user/user.model");

const Authorization = async (req, res, next) => {
  const token = req.cookies.access_token; // دریافت توکن از کوکی‌ها

  if (!token) {
    // اگر توکن وجود نداشت
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // تایید صحت توکن
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // فرآیند وریفای کردن توکن

    // جستجو برای پیدا کردن کاربر در پایگاه داده
    const user = await UserModel.findById(decoded.userId); // فرض بر این است که userId در توکن ذخیره شده است

    if (!user) {
      // اگر کاربر پیدا نشد
      return res.status(404).json({ message: 'User not found' });
    }

    // ذخیره اطلاعات کاربر در درخواست
    req.user = user;

    next(); // ادامه اجرای درخواست

  } catch (error) {
    // اگر توکن معتبر نباشد یا خطای دیگری رخ دهد
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = Authorization;
