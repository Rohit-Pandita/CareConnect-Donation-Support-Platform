import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('accessToken', response.data.data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Requests endpoints
export const requestService = {
  createRequest: (data) => api.post('/requests', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAllRequests: (params) => api.get('/requests', { params }),
  getRequestById: (id) => api.get(`/requests/${id}`),
  getUserRequests: () => api.get('/requests/user/my-requests'),
  updateRequest: (id, data) => api.put(`/requests/${id}`, data),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
  updateRequestStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};

// Comments endpoints
export const commentService = {
  addComment: (requestId, data) => api.post(`/requests/${requestId}/comments`, data),
  getComments: (requestId) => api.get(`/requests/${requestId}/comments`),
  deleteComment: (requestId, commentId) => api.delete(`/requests/${requestId}/comments/${commentId}`),
};

// Donations endpoints
export const donationService = {
  acceptRequest: (requestId) => api.post(`/donations/requests/${requestId}/accept`),
  getDonations: () => api.get(`/donations`),
  updateDonationStatus: (donationId, status) => api.patch(`/donations/${donationId}/status`, { status }),
  getCaretakerContact: (requestId) => api.get(`/donations/requests/${requestId}/caretaker-contact`),
};

// Notifications endpoints
export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Admin endpoints
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (userId) => api.patch(`/admin/users/${userId}/block`),
  unblockUser: (userId) => api.patch(`/admin/users/${userId}/unblock`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllRequests: (params) => api.get('/admin/requests', { params }),
  deleteRequest: (requestId) => api.delete(`/admin/requests/${requestId}`),
};