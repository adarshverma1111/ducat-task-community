import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import postService from '../services/postService';
import { getErrorMessage } from '../utils/helpers';
import './CreatePost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(id);
      const post = data.data;
      setFormData({
        title: post.title,
        content: post.content,
        tags: post.tags.join(', ')
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      await postService.updatePost(id, postData);
      toast.success('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="create-post-container">
          <h1>Edit Post</h1>
          
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
                placeholder="Separate tags with commas"
              />
              <small className="form-hint">
                Enter tags separated by commas
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Post'}
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

export default EditPost;
