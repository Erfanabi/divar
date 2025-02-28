const express = require('express');
const router = express.Router();
const PostController = require('./post.controller');
const Authorization = require("../../common/guard/authorization.quard");

router.get("/create", PostController.createPostPage);

router.post("/create", PostController.create);


module.exports = { PostRouter: router };