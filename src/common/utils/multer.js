const multer = require('multer'); // ماژول Multer برای مدیریت آپلود فایل‌ها
const path = require('path'); // ماژول path برای کار با مسیرهای فایل
const fs = require('fs'); // ماژول fs برای خواندن و نوشتن فایل‌ها
const crypto = require('crypto'); // ماژول crypto برای تولید نام‌های یکتا

// تعیین مسیر پوشه ذخیره‌سازی فایل‌ها
const uploadDir = 'uploads';

// بررسی اینکه آیا پوشه "uploads/" وجود دارد یا نه. اگر وجود نداشت، ساخته می‌شود.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // `recursive: true` باعث می‌شود پوشه‌های والد نیز ساخته شوند (در صورت نبودن)
}

// تنظیمات ذخیره‌سازی فایل‌ها با Multer
const storage = multer.diskStorage({
  // تابع تعیین مسیر ذخیره فایل‌ها
  destination: function (req, file, cb) {
    cb(null, uploadDir); // همه فایل‌ها در پوشه `uploads/` ذخیره می‌شوند
  },

  // تابع تعیین نام فایل‌های ذخیره‌شده
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // تولید یک رشته تصادفی یکتا برای نام فایل
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // نام نهایی فایل
  }
});

// تعیین فرمت‌های مجاز برای آپلود
const allowedFileTypes = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
};

// فیلتر کردن فقط فایل‌های تصویری
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase(); // دریافت پسوند فایل و تبدیل آن به حروف کوچک
  const isValidMime = allowedFileTypes[ext] && file.mimetype === allowedFileTypes[ext]; // بررسی نوع فایل

  if (isValidMime) {
    cb(null, true); // اگر فرمت مجاز باشد، اجازه آپلود داده می‌شود
  } else {
    cb(new Error('❌ فقط فایل‌های تصویری با فرمت‌های JPEG، PNG و GIF مجاز هستند!'), false); // در غیر این صورت، خطا داده می‌شود
  }
};

// تنظیمات اصلی Multer برای مدیریت آپلود
const upload = multer({
  storage: storage, // استفاده از تنظیمات ذخیره‌سازی سفارشی
  limits: { fileSize: 5 * 1024 * 1024 }, // محدودیت حجم فایل: ۵ مگابایت (۵ * ۱۰۲۴ * ۱۰۲۴ بایت)
  fileFilter: fileFilter, // استفاده از فیلتر بررسی فرمت فایل
});

// اکسپورت Middleware تا در فایل‌های دیگر بتوان از آن استفاده کرد
module.exports = upload;
