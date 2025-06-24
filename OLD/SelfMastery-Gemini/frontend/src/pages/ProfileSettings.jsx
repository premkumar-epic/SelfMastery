// src/pages/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserProfile, updateProfile, changePassword } from '../services/api.js';


const ProfileSettings = () => {
  const { user, loading: authLoading, setUser } = useAuth(); // Destructure setUser to update context
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; // Wait for user context to load
      setLoading(true);
      setError('');
      setSuccessMessage('');
      try {
        const response = await getUserProfile();
        setProfileName(response.data.name);
        setProfileEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.error || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user) { // Only fetch if user object is available
        fetchProfile();
    }
  }, [user]); // Re-fetch if user object changes (e.g., after login)

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await updateProfile({ name: profileName, email: profileEmail });
      setSuccessMessage(response.data.message);
      // Update user in AuthContext if profile changed
      setUser(response.data.user);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
    }
    try {
      const response = await changePassword({ currentPassword, newPassword });
      setSuccessMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || 'Failed to change password.');
    }
  };

  if (authLoading || loading) {
    return <div className="profile-settings-container">Loading Profile...</div>;
  }

  if (!user) { // Should not happen if protected route works
      return <div className="profile-settings-container">Please log in to view settings.</div>
  }

  return (
    <div className="profile-settings-container">
      <header className="profile-settings-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>User Profile & Settings</h1>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <section className="profile-details-section">
        <h2>Update Profile Details</h2>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <label>
            Name:
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">Update Profile</button>
        </form>
      </section>

      <section className="password-change-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange} className="password-form">
          <label>
            Current Password:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm New Password:
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Change Password</button>
        </form>
      </section>
    </div>
  );
};

export default ProfileSettings;