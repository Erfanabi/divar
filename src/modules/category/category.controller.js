const categoryService = require('./category.service');
const autoBind = require('auto-bind');
const { CategoryMessage } = require("./category.message");

class CategoryController {
  #service;

  constructor() {
    autoBind(this);    // در کل کلاس this بایند می شود
    this.#service = categoryService;
  }

  // ایجاد دسته‌بندی جدید
  async create(req, res, next) {
    const { name, icon, slug, parent } = req.body;

    try {
      const categoryData = { name, icon, slug, parent };
      const category = await this.#service.create(categoryData);

      res.status(201).json({ message: CategoryMessage.Created, category });
    } catch (error) {
      next(error);
    }
  }

  // دریافت لیست دسته‌بندی‌ها
  async find(req, res, next) {
    try {
      const categories = await this.#service.findAll();
      res.status(200).json({ message: "Categories retrieved successfully", categories });
    } catch (error) {
      next(error);
    }
  }

  // دریافت یک دسته‌بندی خاص بر اساس `slug`
  async findBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await this.#service.findBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "❌ دسته‌بندی یافت نشد." });
      }
      res.status(200).json({ message: "✅ دسته‌بندی دریافت شد.", category });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new CategoryController();