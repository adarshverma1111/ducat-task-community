const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Content must be at least 1 character'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAdminReply: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ isAdminReply: 1 });

// Update post's comment count after saving a comment
commentSchema.post('save', async function() {
  const Post = mongoose.model('Post');
  const commentCount = await mongoose.model('Comment').countDocuments({ post: this.post });
  await Post.findByIdAndUpdate(this.post, { commentsCount: commentCount });
});

// Update post's comment count after removing a comment
commentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Post = mongoose.model('Post');
    const commentCount = await mongoose.model('Comment').countDocuments({ post: doc.post });
    await Post.findByIdAndUpdate(doc.post, { commentsCount: commentCount });
  }
});

module.exports = mongoose.model('Comment', commentSchema);
