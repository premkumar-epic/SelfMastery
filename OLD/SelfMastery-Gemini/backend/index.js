// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import the MongoDB connection function
const taskListRoutes = require('./routes/tasklist'); // Import task list and task routes
const userRoutes = require('./routes/user'); // Import user routes
const errorHandler = require('./middleware/error-handler'); // Import error handling middleware

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use('/api', taskListRoutes); // Mount task list and task routes under /api
app.use('/api', userRoutes); // Mount user routes under /api

// Centralized error handling middleware (should be last middleware)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});