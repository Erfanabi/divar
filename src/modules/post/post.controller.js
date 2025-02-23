const postService = require('./post.service');
const autoBind = require('auto-bind');
const { PostMessage } = require("./post.message");
const categoryService = require("../category/category.service");

class CategoryController {
  #service;
  #categoryService

  constructor() {
    autoBind(this);    // در کل کلاس this بایند می شود
    this.#service = postService;
    this.#categoryService = categoryService
  }

  async createPostPage(req, res, next) {
    try {
      const { slug } = req.query; // دریافت slug از query params
      let options

      if (slug) {
        // اگر `slug` وجود دارد، به دنبال دسته‌بندی و زیربخش‌های آن می‌گردیم
        const categoryWithChildren = await this.#categoryService.findBySlug(slug);
        console.log("ddddaaaa",categoryWithChildren._id)
        options = await this.#service.getCategoryOptions(categoryWithChildren._id);

        console.log(categoryWithChildren)

        if (categoryWithChildren.length === 0) {
          return res.status(404).json({ message: 'دسته‌بندی مورد نظر پیدا نشد.' });
        }

        return res.status(200).json({
          message: '✅ گزینه‌ها برای دسته‌بندی دریافت شدند.',
          options: options,
          categoryWithChildren: categoryWithChildren.children,  // فقط children را برمی‌گردانیم
        });
      }

      // اگر `slug` وجود نداشت، فقط دسته‌بندی‌های سطح اول را نمایش می‌دهیم
      const categories = await this.#service.findAll(); // متد findAll برای گرفتن لیست تمام دسته‌بندی‌های سطح اول

      return res.status(200).json({
        message: 'تمام دسته‌بندی‌ها دریافت شدند.',
        categories,
      });

    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  async find(req, res, next) {
    try {

    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {

    } catch (error) {
      next(error); // ارسال خطا به middleware برای مدیریت خطاها
    }
  }
}

module.exports = new CategoryController();