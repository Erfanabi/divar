// src/modules/option/option.routes.js

const express = require('express');
const router = express.Router();
const OptionController = require('./option.controller');

router.post('/create', OptionController.create);

router.get('/by-category/:categoryId', OptionController.findByCategoryId);

router.get('/by-category-slug/:slug', OptionController.findByCategorySlug);

router.get("/:id", OptionController.findById);

router.get("/", OptionController.find);

router.delete("/:id", OptionController.deleteById);

router.put("/:id", OptionController.update);


module.exports = { OptionRouter: router };
