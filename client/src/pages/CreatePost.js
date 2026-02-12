import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import postService from '../services/postService';
import { getErrorMessage } from '../utils/helpers';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      await postService.createPost(postData);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="create-post-container">
          <h1>Create New Post</h1>
          
          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                minLength={3}
                maxLength={200}
                placeholder="Enter post title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-textarea large"
                required
                minLength={10}
                maxLength={10000}
                placeholder="Write your post content..."
                rows={12}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (optional)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="Separate tags with commas (e.g., technology, discussion)"
              />
              <small className="form-hint">
                Enter tags separated by commas
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Post...' : 'Create Post'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
