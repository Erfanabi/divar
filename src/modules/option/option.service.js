const autoBind = require("auto-bind");
const slugify = require("slugify");
const OptionModel = require("./option.model");
const CategoryModel = require("../category/category.model");
const { OptionMessage } = require("./option.message");
const { isTrue, isFalse } = require("../../common/utils/function");
const { isValidObjectId } = require("mongoose");

class OptionService {
  #model
  #categoryModel

  constructor() {
    autoBind(this);
    this.#model = OptionModel;
    this.#categoryModel = CategoryModel;
  }

  // ایجاد یک گزینه جدید
  async create(optionDto) {
    try {
      // در ابتدا، شناسه دسته‌بندی (category) موجود در optionDto بررسی می‌شود تا از وجود آن در دیتابیس اطمینان حاصل شود.
      // اگر دسته‌بندی وجود نداشته باشد، به احتمال زیاد خطا تولید خواهد شد.
      const category = await this.checkExistCategoryById(optionDto.category);
      // console.log(category);

      // گزینه با استفاده از slugify به فرمت اسلاگ تبدیل می‌شود
      // . اسلاگ‌ها برای استفاده در URL مناسب هستند و شامل حروف کوچک و خط‌تیره (_) به جای فاصله هستند.
      optionDto.key = slugify(optionDto.key, { trim: true, replacement: "_", lower: true });
      // console.log(optionDto.key)

      // با استفاده از متد alreadyExistByCategoryAndKey، بررسی می‌شود که آیا گزینه‌ای با همین key در همان دسته‌بندی (category) وجود دارد یا نه.
      // در صورتی که این گزینه وجود داشته باشد، یک خطای Conflict برمی‌گرداند.
      await this.alreadyExistByCategoryAndKey(optionDto.key, category._id)

      // اگر فیلد enum به صورت رشته (string) ارسال شده باشد، آن را به آرایه‌ای از مقادیر تبدیل می‌کند.
      // به عنوان مثال، یک رشته مانند "قرمز,آبی,سبز" به آرایه ["قرمز", "آبی", "سبز"] تبدیل می‌شود.
      // اگر enum به صورت آرایه نباشد، آن را به آرایه خالی تبدیل می‌کند.
      if (optionDto?.enum && typeof optionDto.enum === "string") {
        optionDto.enum = optionDto.enum.split(",")
      } else if (!Array.isArray(optionDto.enum)) optionDto.enum = [];
      // console.log(optionDto.enum)

      if (isTrue(optionDto.required)) optionDto.required = true
      if (isFalse(optionDto.required)) optionDto.required = false

      return await this.#model.create(optionDto);

    } catch (error) {
      throw new Error("خطا در ایجاد گزینه: " + error.message); // مدیریت خطاها
    }
  }

  // دریافت تمام گزینه‌ها
  async find() {
    try {
      // دریافت تمام گزینه‌ها از دیتابیس
      return await OptionModel.find({}, { __v: 0 }, { sort: { _id: -1 } }).populate([{
        path: "category", select: { name: 1, slug: 1 }
      }]);
    } catch (error) {
      throw new Error("خطا در دریافت تمام گزینه‌ها: " + error.message);
    }
  }

  // دریافت یک گزینه خاص بر اساس شناسه
  async findById(id) {
    return await this.checkExistById(id)
  }

  // دریافت گزینه‌ها بر اساس شناسه دسته‌بندی
  async findByCategoryId(categoryId) {
    return await this.#model.find({ category: categoryId }, { __v: 0 }).populate([{
      path: "category", select: { name: 1, slug: 1 }
    }])
  }

  // پیدا کردن دسته‌بندی بر اساس slug
  async findByCategorySlug(slug) {
    try {
      return await this.#model.aggregate([{
        $lookup: {
          from: "categories", localField: "category", foreignField: "_id", as: "category"
        },
      }, {
        $unwind: "$category" // حذف آرایه
      }, {
        $addFields: {
          categorySlug: "$category.slug", categoryName: "$category.name", categoryIcon: "$category.icon",
        },
      }, {
        $project: { // نشون ندادن
          __v: 0, category: 0
        }
      }, {
        $match: { // find کردن
          categorySlug: slug
        }
      }]);
    } catch (error) {
      throw new Error('Error finding category by slug: ' + error.message);
    }
  }

  // حذف گزینه بر اساس شناسه
  async deleteById(id) {
    try {
      await this.checkExistById(id)

      return await this.#model.deleteOne({ _id: id });
    } catch (error) {
      throw new Error("خطا در حذف گزینه: " + error.message); // مدیریت خطا
    }
  }

  async update(id, optionDto) {
    // 1. بررسی اینکه گزینه‌ای با این شناسه وجود دارد یا نه
    const existOption = await this.checkExistById(id);

    // 2. بررسی اعتبار `category` و تنظیم مقدار آن در `optionDto`
    if (optionDto.category && isValidObjectId(optionDto.category)) {
      // بررسی اینکه گزینه‌ای با این دسته بندی وجود دارد یا نه
      const category = await this.checkExistCategoryById(optionDto.category);
      optionDto.category = category._id;
    } else {
      delete optionDto.category;
    }

    // 3. بررسی و تغییر مقدار `key` در صورتی که `slug` ارسال شده باشد
    if (optionDto.slug) {
      optionDto.key = slugify(optionDto.key, { trim: true, replacement: "_", lower: true });

      let categoryId = existOption.category; // مقدار اولیه `category` از گزینه‌ای که در حال آپدیت است

      if (optionDto.category) categoryId = optionDto.category; // اگر `category` جدید ارسال شده باشد، مقدار آن را تغییر بده

      await this.alreadyExistByCategoryAndKey(optionDto.key, categoryId);
    }

    // 4. تبدیل مقدار `enum` در صورتی که رشته (`string`) باشد
    if (optionDto?.enum && typeof optionDto.enum === "string") {
      optionDto.enum = optionDto.enum.split(",");
    } else if (!Array.isArray(optionDto.enum)) {
      delete optionDto.enum; // اگر مقدار `enum` درست نبود، آن را حذف کن
    }

    // 5. پردازش مقدار `required` (اگر مقدار درست باشد آن را تنظیم کن، در غیر اینصورت حذف شود)
    if (isTrue(optionDto?.required)) {
      optionDto.required = true;
    } else if (isFalse(optionDto?.required)) {
      optionDto.required = false;
    } else {
      delete optionDto?.required; // اگر مقدار نامعتبر بود، حذف شود
    }

    // 6. اجرای دستور آپدیت در دیتابیس
    return await this.#model.updateOne({ _id: id }, { $set: optionDto });
  }

  // ----------

  // بررسی وجود دسته‌بندی
  async checkExistCategoryById(id) {
    const category = await this.#categoryModel.findById(id);
    if (!category) throw new Error(OptionMessage.NotFound);
    return category;
  }

  // بررسی وجود option
  async checkExistById(id) {
    const option = await this.#model.findById(id);
    if (!option) throw new Error(OptionMessage.NotFound);
    return option;
  }

  // بررسی وجود گزینه با همین category و key
  async alreadyExistByCategoryAndKey(key, category) {
    const isExist = await this.#model.findOne({ category, key });
    if (isExist) throw new Error(OptionMessage.AlreadyExist);
    return null;
  }

}

module.exports = new OptionService();