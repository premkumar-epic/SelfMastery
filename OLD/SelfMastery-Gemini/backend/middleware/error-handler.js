// middleware/error-handler.js
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
  
    // Handle specific error types, e.g., JSON parsing errors
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  
    // Default to a generic 500 Internal Server Error
    res.status(500).json({ error: 'Internal server error' });
};
  
module.exports = errorHandler;