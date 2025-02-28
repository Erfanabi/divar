const { Schema, Types, model } = require("mongoose");

const PostSchema = new Schema({
  title: { type: String, required: true }, // عنوان آگهی
  userId: { type: Types.ObjectId, required: false }, // شناسه کاربر
  amount: { type: Number, required: true, default: 0 }, // مقدار یا قیمت
  content: { type: String, required: true }, // محتوای آگهی
  category: { type: Types.ObjectId, ref: "Category", required: false }, // دسته‌بندی آگهی
  province: { type: String, required: false }, // استان
  city: { type: String, required: false }, // شهر
  district: { type: String, required: false }, // منطقه
  address: { type: String, required: false }, // آدرس
  coordinate: { type: [Number], required: true }, // مختصات جغرافیایی
  images: { type: [String], required: false, default: [] }, // تصاویر آگهی
  options: { type: Object, default: {} } // گزینه‌های اضافی
}, {
  timestamps: true // زمان‌بندی ایجاد و به‌روزرسانی
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
