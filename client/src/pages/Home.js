import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import postService from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts({ page, limit: 10 });
      setPosts(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await postService.likePost(postId);
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user.id);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user.id)
              : [...post.likes, user.id]
          };
        }
        return post;
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

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>Community Posts</h1>
          <p>Share your thoughts and connect with others</p>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Be the first to create a post!</p>
          </div>
        ) : (
          <>
            <div className="posts-list">
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  currentUser={user}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
