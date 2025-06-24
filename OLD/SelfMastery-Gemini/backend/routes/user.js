// routes/user.js
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const { userValidationRules, loginValidationRules } = require('../utils/validation');

const secretKey = 'yourSecretKey'; // Replace with your own strong secret key
const saltRounds = 10; // For bcrypt hashing

// User registration
router.post('/users', userValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user document
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save(); // Save the new user to MongoDB

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
router.post('/login', loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send the token and basic user info back to the client
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// routes/user.js (Add these new routes to your existing file)
// ... (existing imports and user/login routes) ...

const { authenticate } = require('../middleware/auth'); // Ensure authenticate is imported

// Get user profile (authenticated)
router.get('/profile', authenticate, async (req, res) => {
  try {
    // req.user is populated by the authenticate middleware
    // Only send necessary data, avoid sending hashed password
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (name/email, authenticated)
router.put('/profile', authenticate, async (req, res) => {
  const { name, email } = req.body; // Password change handled separately below
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate if new email already exists (if changing email)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({ message: 'Profile updated successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change user password (authenticated)
router.put('/profile/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;