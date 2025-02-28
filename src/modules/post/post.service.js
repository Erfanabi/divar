const autoBind = require("auto-bind");
const CategoryModel = require("../category/category.model");
const { PostMessage } = require("./post.message");
const PostModel = require("./post.model");
const OptionModel = require("../option/option.model");

class PostService {
  #model;
  #optionModel;
  #categoryModel;

  constructor() {
    autoBind(this);
    this.#model = PostModel;
    this.#optionModel = OptionModel;
    this.#categoryModel = CategoryModel;
  }

  async findAll() {
    try {
      return await this.#categoryModel.aggregate([
        {
          $match: { parent: null }  // فقط دسته‌بندی‌هایی که `parent` آن‌ها `null` است
        },
        {
          $project: {
            __v: 0,  // حذف فیلد `__v`
            parent: 0  // حذف فیلد `parent`
          }
        }
      ]);
    } catch (error) {
      throw new Error("خطا در دریافت دسته‌بندی‌ها: " + error.message);
    }
  }

  async getCategoryOptions(categoryId) {
    try {
      return await this.#optionModel.find({ category: categoryId });

    } catch (error) {
      throw new Error("خطا در دریافت آپشن ها: " + error.message);
    }
  }

  async findByCategorySlug(slug) {
    return await this.#categoryModel.aggregate([
      {
        $match: { slug } // فیلتر کردن بر اساس `slug`
      },
      {
        $lookup: {
          from: "categories",  // نام مجموعه‌ای که می‌خواهید داده‌ها را از آن بگیرید
          localField: "_id",  // فیلدی در مجموعه اصلی که باید با فیلد مجموعه دیگر مقایسه شود
          foreignField: "parent",  // فیلدی در مجموعه دیگر که با فیلد `localField` در مجموعه اصلی مقایسه خواهد شد
          as: "children",  // نام فیلدی که داده‌ها در آن قرار خواهند گرفت
        }
      },
      {
        $project: {
          __v: 0,  // حذف فیلد `__v`
          parent: 0, // حذف فیلد `parent`
        }
      }
    ]);
  }

  async create(dto) {
    return await this.#model.create(dto);
  }
}

module.exports = new PostService();