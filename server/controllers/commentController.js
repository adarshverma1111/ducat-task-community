const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username avatar role')
      .sort({ isAdminReply: -1, createdAt: -1 }) // Admin replies first
      .limit(limit)
      .skip(skip);

    const total = await Comment.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user.id,
      isAdminReply: false
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar role');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin reply on a post
// @route   POST /api/posts/:postId/admin-reply
// @access  Private (admin only)
exports.createAdminReply = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user.id,
      isAdminReply: true
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar role');

    res.status(201).json({
      success: true,
      message: 'Admin reply added successfully',
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (comment owner or admin)
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'username avatar role');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (comment owner or admin)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if already liked
    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      data: {
        likes: comment.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    next(error);
  }
};
