const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Route to get all posts
router.get('/posts', postsController.getAllPosts);

// Route to create a new post
router.post('/posts', postsController.createPost);

// Route to add a comment to a post
router.post('/posts/:postId/comments', postsController.addComment);

module.exports = router;
