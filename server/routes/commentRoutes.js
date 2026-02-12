const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getComments, 
  createComment, 
  createAdminReply,
  updateComment, 
  deleteComment, 
  likeComment 
} = require('../controllers/commentController');
const { 
  createCommentValidation, 
  updateCommentValidation 
} = require('../validators/commentValidators');
const validate = require('../middleware/validate');

// Comment routes nested under posts
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', protect, createCommentValidation, validate, createComment);
router.post('/posts/:postId/admin-reply', protect, authorize('admin'), createCommentValidation, validate, createAdminReply);

// Comment-specific routes
router.put('/comments/:id', protect, updateCommentValidation, validate, updateComment);
router.delete('/comments/:id', protect, deleteComment);
router.put('/comments/:id/like', protect, likeComment);

module.exports = router;
