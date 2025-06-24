// src/services/api.js
import axios from 'axios';

// Vite exposes env variables via import.meta.env, prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User Authentication
export const registerUser = (userData) => api.post('/users', userData);
export const loginUser = (credentials) => api.post('/login', credentials);

// Task List API
export const getTaskLists = () => api.get('/tasklists');
export const createTaskList = (listData) => api.post('/tasklists', listData);
export const getTaskListById = (listId) => api.get(`/tasklists/${listId}`);
export const updateTaskList = (listId, listData) => api.put(`/tasklists/${listId}`, listData);
export const deleteTaskList = (listId) => api.delete(`/tasklists/${listId}`);

// Task API
export const getTasksByTaskList = (listId) => api.get(`/tasklists/${listId}/tasks`);
export const createTask = (listId, taskData) => api.post(`/tasklists/${listId}/tasks`, taskData);
export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`); // Not currently used by frontend, but good to have
export const updateTask = (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

// NEW FUNCTION: Get all tasks for the user
export const getAllTasks = () => api.get('/tasks');


// User Profile API
export const getUserProfile = () => api.get('/profile');
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const changePassword = (passwordData) => api.put('/profile/password', passwordData);