const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} = require('../controllers/postController');
const { 
  createPostValidation, 
  updatePostValidation 
} = require('../validators/postValidators');
const validate = require('../middleware/validate');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPostValidation, validate, createPost);
router.put('/:id', protect, updatePostValidation, validate, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;
