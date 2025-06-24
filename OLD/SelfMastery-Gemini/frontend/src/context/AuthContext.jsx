// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/api'; // Import your API functions

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data (id, name, email)
  const [token, setToken] = useState(null); // Stores the JWT token
  const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded

  // Effect to load user and token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Clear corrupted data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false); // Authentication state has been loaded
  }, []);

  // Function to handle user login
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      throw error; // Re-throw the error for the component to handle
    }
  };

  // Function to handle user registration
  const register = async (userData) => {
    try {
      await registerUser(userData);
      return true; // Indicate successful registration
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      throw error; // Re-throw the error for the component to handle
    }
  };

  // Function to handle user logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('user'); // Remove user data from localStorage
  };

  // Provide the context values to children
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {/* Render children only after loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};