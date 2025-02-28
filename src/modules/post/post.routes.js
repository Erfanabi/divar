const express = require('express');
const router = express.Router();
const PostController = require('./post.controller');
const Authorization = require("../../common/guard/authorization.quard");
const { upload } = require("../../common/utils/multer1");

router.get("/create", PostController.createPostPage);

router.post("/create", Authorization, upload.array('images', 10), PostController.create);

router.get("/my", Authorization, PostController.findMyPosts);

router.delete("/delete/:id", Authorization, PostController.remove);


module.exports = { PostRouter: router };