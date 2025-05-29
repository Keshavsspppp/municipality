import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// User related API calls
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');
export const updateUser = (userId, userData) => api.patch(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// Department related API calls
export const getDepartments = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (departmentData) => api.post('/departments', departmentData);
export const updateDepartment = (id, departmentData) => api.patch(`/departments/${id}`, departmentData);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// Project related API calls
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (projectData) => api.post('/projects', projectData);
export const updateProject = (id, projectData) => api.patch(`/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Meeting related API calls
export const getMeetings = () => api.get('/meetings');
export const getMeeting = (id) => api.get(`/meetings/${id}`);
export const createMeeting = (meetingData) => api.post('/meetings', meetingData);
export const updateMeeting = (id, meetingData) => api.patch(`/meetings/${id}`, meetingData);
export const deleteMeeting = (id) => api.delete(`/meetings/${id}`);

// Forum related API calls - Add all forum related API calls back
export const getForums = () => api.get('/forums');
export const getForum = (id) => api.get(`/forums/${id}`);
export const createForum = (forumData) => api.post('/forums', forumData);
export const updateForum = (id, forumData) => api.patch(`/forums/${id}`, forumData);
export const deleteForum = (id) => api.delete(`/forums/${id}`);
export const createPost = (forumId, postData) => api.post(`/forums/${forumId}/posts`, postData);
export const updatePost = (forumId, postId, postData) => api.patch(`/forums/${forumId}/posts/${postId}`, postData);
export const deletePost = (forumId, postId) => api.delete(`/forums/${forumId}/posts/${postId}`);

// Function to get messages for a forum
export const getForumMessages = (forumId) => api.get(`/forums/${forumId}/messages`);

export default api;