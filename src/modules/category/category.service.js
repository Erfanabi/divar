const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const { CategoryMessage } = require("./category.message");

class CategoryService {
  #model

  constructor() {
    autoBind(this);
    this.#model = CategoryModel;
  }

  // ایجاد دسته‌بندی جدید
  async create(categoryDto) {
    try {
      // اگر این دسته‌بندی دارای والد (`parent`) باشد، باید والد را به آرایه parents اضافه کنیم
      if (categoryDto.parent) {
        const parentCategory = await this.#model.findById(categoryDto.parent);

        if (!parentCategory) {
          throw new Error(CategoryMessage.NotFound);
        }
        categoryDto.parents = [...parentCategory.parents, categoryDto.parent];
      }

      const newCategory = new this.#model(categoryDto);
      return await newCategory.save();
    } catch (error) {
      throw new Error("Error creating category: " + error.message);
    }
  }

  // دریافت تمام دسته‌بندی‌ها با اطلاعات والد-فرزند
  async findAll() {
    try {
      return await this.#model.find({ parent: null }).populate("children").exec();
    } catch (error) {
      throw new Error("خطا در دریافت دسته‌بندی‌ها: " + error.message);
    }
  }

  async findBySlug(slug) {
    try {
      return await this.#model.findOne({ slug }).populate("children").exec();
    } catch (error) {
      throw new Error("خطا در دریافت دسته‌بندی: " + error.message);
    }
  }
}

module.exports = new CategoryService();