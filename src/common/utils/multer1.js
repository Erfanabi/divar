const multer = require('multer'); // ماژول Multer برای مدیریت آپلود فایل‌ها
const fs = require("fs"); // ماژول fs برای خواندن و نوشتن در سیستم فایل
const path = require('path'); // ماژول path برای مدیریت مسیرها
const createHttpError = require('http-errors'); // ماژول مدیریت خطاهای HTTP

// مسیر پوشه ذخیره‌سازی فایل‌ها
const uploadDir = path.join(process.cwd(), "public", "upload");

// بررسی و ایجاد پوشه `public/upload` در صورت نبودن
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // `recursive: true` باعث می‌شود که در صورت نیاز، پوشه‌های والد نیز ساخته شوند.
}

// فرمت‌های مجاز برای فایل‌های تصویری
const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

// تنظیمات ذخیره‌سازی فایل‌ها با Multer
const storage = multer.diskStorage({
  // مسیر ذخیره‌سازی فایل‌ها
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ذخیره‌سازی فایل‌ها در پوشه `public/upload`
  },

  // نام‌گذاری فایل‌های ذخیره‌شده
  filename: function (req, file, cb) {
    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new createHttpError.BadRequest("❌ فرمت فایل نامعتبر است! فقط تصاویر با فرمت‌های PNG، JPG، JPEG و WEBP مجاز هستند."));
    }

    const fileExt = path.extname(file.originalname); // دریافت پسوند فایل
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + fileExt; // تولید نام یکتا
    cb(null, uniqueName); // ذخیره فایل با نام جدید
  }
});

// تنظیمات Multer برای مدیریت آپلود
const upload = multer({
  storage, // استفاده از تنظیمات ذخیره‌سازی سفارشی
  limits: {
    fileSize: 3 * 1024 * 1024, // حداکثر حجم فایل: ۳ مگابایت
    // files: 5 // حداکثر تعداد فایل‌های آپلودی در هر درخواست
  }
});

// اکسپورت Middleware برای استفاده در روت‌ها یا کنترلرها
module.exports = {
  upload
};
