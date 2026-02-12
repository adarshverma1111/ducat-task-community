import React, { useState } from 'react';
import { FiHeart, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete, onUpdate, onLike, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUser?.id === comment.author._id;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  const handleUpdate = () => {
    onUpdate(comment._id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`comment-item ${comment.isAdminReply ? 'admin-reply' : ''}`}>
      {comment.isAdminReply && (
        <div className="admin-badge">
          <span className="badge badge-admin">Official Admin Reply</span>
        </div>
      )}
      
      <div className="comment-header">
        <div className="comment-author">
          <img 
            src={comment.author.avatar || 'https://via.placeholder.com/32'} 
            alt={comment.author.username}
            className="comment-avatar"
          />
          <div>
            <h5>{comment.author.username}</h5>
            {comment.author.role === 'admin' && !comment.isAdminReply && (
              <span className="badge badge-admin small">Admin</span>
            )}
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        
        {canEdit && !isEditing && (
          <div className="comment-actions">
            <button onClick={() => setIsEditing(true)} className="btn-icon">
              <FiEdit />
            </button>
            <button onClick={() => onDelete(comment._id)} className="btn-icon danger">
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="comment-edit">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="form-textarea"
          />
          <div className="edit-actions">
            <button onClick={handleUpdate} className="btn btn-primary btn-small">
              <FiCheck /> Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary btn-small">
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

      <div className="comment-footer">
        <button 
          onClick={() => onLike(comment._id)} 
          className={`comment-like ${comment.likes?.includes(currentUser?.id) ? 'active' : ''}`}
        >
          <FiHeart /> {comment.likes?.length || 0}
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
