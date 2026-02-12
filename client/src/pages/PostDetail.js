import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiHeart, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import CommentItem from '../components/CommentItem';
import postService from '../services/postService';
import commentService from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import { formatDate, getErrorMessage } from '../utils/helpers';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(id);
      setPost(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await commentService.getComments(id);
      setComments(data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleLikePost = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await postService.likePost(id);
      setPost(prev => ({
        ...prev,
        likes: prev.likes.includes(user.id)
          ? prev.likes.filter(likeId => likeId !== user.id)
          : [...prev.likes, user.id]
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentContent.trim()) return;

    setSubmitting(true);

    try {
      const serviceMethod = isAdmin 
        ? commentService.createAdminReply 
        : commentService.createComment;
      
      const data = await serviceMethod(id, { content: commentContent });
      setComments([data.data, ...comments]);
      setCommentContent('');
      toast.success(isAdmin ? 'Admin reply added!' : 'Comment added!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateComment = async (commentId, updateData) => {
    try {
      const data = await commentService.updateComment(commentId, updateData);
      setComments(comments.map(c => c._id === commentId ? data.data : c));
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await commentService.likeComment(commentId);
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          const isLiked = comment.likes.includes(user.id);
          return {
            ...comment,
            likes: isLiked
              ? comment.likes.filter(id => id !== user.id)
              : [...comment.likes, user.id]
          };
        }
        return comment;
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.author._id;
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="post-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> Back
        </button>

        <article className="post-detail">
          <div className="post-detail-header">
            <div className="post-author-info">
              <img 
                src={post.author.avatar || 'https://via.placeholder.com/60'} 
                alt={post.author.username}
                className="author-avatar-large"
              />
              <div>
                <h4>{post.author.username}</h4>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            {canEdit && (
              <div className="post-actions">
                <Link to={`/edit-post/${post._id}`} className="btn btn-secondary btn-small">
                  <FiEdit /> Edit
                </Link>
                <button onClick={handleDeletePost} className="btn btn-danger btn-small">
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          <div className="post-detail-content">
            {post.content}
          </div>

          <div className="post-detail-footer">
            <button 
              onClick={handleLikePost}
              className={`post-like-btn ${post.likes?.includes(user?.id) ? 'active' : ''}`}
            >
              <FiHeart /> {post.likes?.length || 0} Likes
            </button>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {user && (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={isAdmin ? "Write an official admin reply..." : "Write a comment..."}
                className="form-textarea"
                rows={4}
                required
              />
              <button 
                type="submit" 
                className={`btn ${isAdmin ? 'btn-warning' : 'btn-primary'}`}
                disabled={submitting}
              >
                {submitting 
                  ? 'Posting...' 
                  : isAdmin 
                    ? 'Post Admin Reply' 
                    : 'Post Comment'
                }
              </button>
            </form>
          )}

          {!user && (
            <div className="login-prompt">
              <p>
                Please <Link to="/login">login</Link> to leave a comment
              </p>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  onUpdate={handleUpdateComment}
                  onLike={handleLikeComment}
                  currentUser={user}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
