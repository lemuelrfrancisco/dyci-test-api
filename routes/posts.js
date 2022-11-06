const express = require('express');

const PostController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', extractFile, PostController.createPost);
// router.post("", checkAuth, extractFile, PostController.createPost);

router.put('/:id', extractFile, PostController.updatePost);
// router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', PostController.deletePost);
// router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
