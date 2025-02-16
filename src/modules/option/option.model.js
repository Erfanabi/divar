const { Schema, Types, model } = require("mongoose");

const OptionSchema = new Schema({
  title: { type: String, required: true }, // عنوان گزینه
  key: { type: String, required: true }, // کلید گزینه
  type: {
    type: String,
    enum: ["number", "string", "array", "boolean"], // انواع داده مجاز برای این گزینه
  },
  enum: { type: Array, default: [] }, // مقادیر مجاز برای گزینه‌ها
  guid: { type: String, required: false }, // شناسه یکتای گلوبال
  required: { type: Boolean, required: true, default: false }, // آیا این گزینه مورد نیاز است؟
  category: { type: Types.ObjectId, ref: "Category", required: true } // ارجاع به دسته‌بندی
});

const OptionModel = model("Option", OptionSchema);

module.exports = OptionModel;
