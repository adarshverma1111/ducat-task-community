import api from './api';

const commentService = {
  getComments: async (postId, params = {}) => {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  createAdminReply: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/admin-reply`, commentData);
    return response.data;
  },

  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  likeComment: async (id) => {
    const response = await api.put(`/comments/${id}/like`);
    return response.data;
  },
};

export default commentService;
