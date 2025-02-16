// src/modules/category/category.routes.js

const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');

router.post('/create', CategoryController.create); // ایجاد دسته‌بندی جدید

router.get('/all', CategoryController.find); // دریافت لیست دسته‌بندی‌ها

router.get('/:slug', CategoryController.findBySlug); // دریافت دسته‌بندی بر اساس slug

router.delete("/:id", CategoryController.remove)


module.exports = { CategoryRouter: router };