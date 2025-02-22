const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const { CategoryMessage } = require("./category.message");
const OptionModel = require("../option/option.model");

class CategoryService {
  #model
  #optionModel

  constructor() {
    autoBind(this);
    this.#model = CategoryModel;
    this.#optionModel = OptionModel;
  }

  // ایجاد دسته‌بندی جدید
  async create(categoryDto) {
    try {
      // اگر این دسته‌بندی دارای والد (`parent`) باشد، باید والد را به آرایه parents اضافه کنیم
      if (categoryDto.parent) {
        // اگر مقدار parent ارسال شده باشد،
        // یعنی این یک زیرمجموعه (Subcategory) است و باید به والد متصل شود.
        const parentCategory = await this.#model.findById(categoryDto.parent);

        if (!parentCategory) {
          throw new Error(CategoryMessage.NotFound);
        }
        // این کار باعث می‌شود که تمام مسیر والدین این دسته‌بندی به‌صورت سلسله‌مراتبی ذخیره شود.
        categoryDto.parents = [...parentCategory.parents, categoryDto.parent];
      }

      // ✅ یک نمونه‌ی جدید از مدل دسته‌بندی (Category) ایجاد می‌شود.
      const newCategory = new this.#model(categoryDto);
      return await newCategory.save();
    } catch (error) {
      throw new Error("Error creating category: " + error.message);
    }
  }

  // دریافت تمام دسته‌بندی‌ها با اطلاعات والد-فرزند
  async findAll() {
    try {
      // یعنی دسته‌بندی‌هایی که والد ندارند (دسته‌بندی‌های سطح بالا یا ریشه‌ای).
      return await this.#model.find({ parent: null });
    } catch (error) {
      throw new Error("خطا در دریافت دسته‌بندی‌ها: " + error.message);
    }
  }

  async findBySlug(slug) {
    try {
      return await this.#model.findOne({ slug });
    } catch (error) {
      throw new Error("خطا در دریافت دسته‌بندی: " + error.message);
    }
  }

  async remove(id) {
    // بررسی اینکه آیا گزینه با این شناسه وجود دارد یا خیر
    await this.checkExistById(id);

    // حذف تمام گزینه‌های مرتبط با این دسته‌بندی
    const deletedOptions = await this.#optionModel.deleteMany({ category: id });

    // حذف خود دسته‌بندی بر اساس ID
    const deletedCategory = await this.#model.deleteOne({ _id: id });

    // اگر دسته‌بندی حذف شد، عملیات خاصی اجرا کن
    if (deletedCategory.deletedCount > 0) {
      console.log(`✅ دسته‌بندی با شناسه ${id} و ${deletedOptions.deletedCount} گزینه مرتبط حذف شد.`);

      // هر عملیات دیگری که باید بعد از حذف موفق اجرا شود، اینجا اضافه کنید
    } else {
      console.log("❌ حذف ناموفق بود. دسته‌بندی یافت نشد.");
    }

    // در انتها، متد remove() یک مقدار boolean برمی‌گرداند:

    //   اگر deletedCategory.deletedCount > 0 باشد (یعنی دسته‌بندی حذف شده باشد)، مقدار true برمی‌گرداند.
    //   اگر دسته‌بندی حذف نشده باشد، مقدار false برمی‌گرداند.
    return deletedCategory.deletedCount > 0;
  }


  async checkExistById(id) {
    const category = await this.#model.findById(id);
    if (!category) throw new (CategoryMessage.NotFound);
    return category;
  }
}

module.exports = new CategoryService();