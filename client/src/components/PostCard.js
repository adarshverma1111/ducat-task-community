import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import { formatDate, truncateText } from '../utils/helpers';
import './PostCard.css';

const PostCard = ({ post, onDelete, onLike, currentUser }) => {
  const isAuthor = currentUser?.id === post.author._id;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <img 
            src={post.author.avatar || 'https://via.placeholder.com/40'} 
            alt={post.author.username}
            className="author-avatar"
          />
          <div>
            <h4>{post.author.username}</h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {canEdit && (
          <div className="post-actions">
            <Link to={`/edit-post/${post._id}`} className="btn-icon">
              <FiEdit />
            </Link>
            <button onClick={() => onDelete(post._id)} className="btn-icon danger">
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      <Link to={`/posts/${post._id}`} className="post-content-link">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{truncateText(post.content, 200)}</p>
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <button 
          onClick={() => onLike(post._id)} 
          className={`post-stat ${post.likes?.includes(currentUser?.id) ? 'active' : ''}`}
        >
          <FiHeart /> {post.likes?.length || 0}
        </button>
        <Link to={`/posts/${post._id}`} className="post-stat">
          <FiMessageCircle /> {post.commentsCount || 0}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
