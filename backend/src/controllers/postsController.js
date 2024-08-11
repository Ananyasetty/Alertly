const Post = require('../models/post');
const path = require('path');
const multer = require('multer');

// Configure multer to save uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

// Fetch all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Create a new post
exports.createPost = [
    upload.single('image'), // Handle image upload
    async (req, res) => {
      try {
        const { caption,username } = req.body;
  
        const imageUrl = req.file ? req.file.path.replace(/\\/g, '/').replace('uploads/', '') : null;

  
        // Create a new post with the formatted image URL
        const newPost = new Post({ userName: username , caption, imageUrl });
  
        // Save the new post to the database
        await newPost.save();
  
        // Respond with the newly created post
        res.status(201).json(newPost);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
  ];
  

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
