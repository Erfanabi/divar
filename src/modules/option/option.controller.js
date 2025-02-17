const optionService = require('./option.service');
const autoBind = require('auto-bind');
const { OptionMessage } = require("./option.message");

class OptionController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = optionService;
  }

  // ایجاد یک گزینه جدید
  async create(req, res, next) {
    try {
      const optionData = req.body; // گرفتن داده‌های گزینه از بدن درخواست
      const option = await this.#service.create(optionData); // فراخوانی متد سرویس برای ایجاد گزینه

      res.status(201).json({ message: OptionMessage.Created, option });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  // دریافت گزینه‌ها بر اساس شناسه دسته‌بندی
  async findByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const option = await this.#service.findByCategoryId(categoryId);

      res.status(200).json({ message: '✅ گزینه‌ها دریافت شدند.', option });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو
    }
  }

  // دریافت یک گزینه خاص بر اساس شناسه
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const option = await this.#service.findById(id);

      if (!option) {
        return res.status(404).json({ message: OptionMessage.NotFound });
      }

      res.status(200).json({ message: '✅ گزینه پیدا شد.', option });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو
    }
  }

  // دریافت تمام گزینه‌ها
  async find(req, res, next) {
    try {
      const options = await this.#service.find();  // دریافت تمام گزینه‌ها
      res.status(200).json({ message: '✅ تمام گزینه‌ها دریافت شدند.', options });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو
    }
  }

  async findByCategorySlug(req, res, next) {
    try {
      // دریافت slug از پارامترهای مسیر
      const { slug } = req.params;

      // فراخوانی سرویس برای دریافت دسته‌بندی بر اساس slug
      const options = await this.#service.findByCategorySlug(slug);

      res.status(200).json({
        message: "✅ گزینه‌ها برای دسته‌بندی دریافت شدند.", options,
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;  // گرفتن شناسه گزینه از پارامترهای URL

      // فراخوانی سرویس برای حذف گزینه
      await this.#service.deleteById(id);

      // ارسال پیام موفقیت‌آمیز در صورت حذف گزینه
      res.status(200).json({
        message: "✅ گزینه با موفقیت حذف شد.",
      });
    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو
    }
  }

  async update(req, res, next) {
    try {
      const { title, key, guid, enum: list, type, category, required } = req.body;
      const { id } = req.params;
      await this.#service.update(id, { title, key, guid, enum: list, type, category, required })
      return res.json({
        message: OptionMessage.Updated
      })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = new OptionController();