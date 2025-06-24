// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const secretKey = 'yourSecretKey'; // Replace with a strong, secret key

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    // Find user by ID from the token payload
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticate };