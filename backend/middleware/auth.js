module.exports = (req, res, next) => {
    // Mock user authentication
    req.user = { username: 'user123' }; // Simulate authenticated user
    next();
  };
  