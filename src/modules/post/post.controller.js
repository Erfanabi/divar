const postService = require('./post.service');
const autoBind = require('auto-bind');
const { PostMessage } = require("./post.message");
const categoryService = require("../category/category.service");
const { Types } = require("mongoose");
const { getAddressDetail } = require("../../common/utils/http");

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
        message: 'تمام دسته‌بندی‌ها دریافت شدند.', categories,
      });

    } catch (error) {
      next(error); // ارسال خطا به میانه‌رو (middleware)
    }
  }

  async create(req, res, next) {
    try {
      // چه کسی این آگهی رو ایجاد کرده
      const userId = req.user._id;

      const { title, lat, lng, description: content } = req.body;

      delete req.body['title'];
      delete req.body['lat'];
      delete req.body['lng'];
      delete req.body['description'];
      delete req.body['images'];
      // delete req.body['category'];

      const options = req.body

      const { address, district, province, city } = await getAddressDetail(lat, lng)

      const images = req.files.map(file => `/public/upload/${file.filename}`);

      await this.#service.create({
        userId, title, content, coordinate: [lat, lng], images, options, // category: new Types.ObjectId(category)
        address, province, city, district,
      });

      return res.status(200).json({ message: PostMessage.Created })
    } catch (error) {
      next(error);
    }
  }

  async findMyPosts(req, res, next) {
    try {
      const userId = req.user._id;
      const posts = await this.#service.find(userId);

      return res.status(200).json({ message: PostMessage.Founded, posts });

    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await this.#service.remove(id);

      return res.status(200).json({ message: PostMessage.Deleted });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();