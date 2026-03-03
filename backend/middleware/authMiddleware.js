const jwt = require('jsonwebtoken');
const Signup = require('../models/Signup'); // Fix: Use Signup model, not User
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  // Check for the 'Authorization' header, starting with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await Signup.findById(decoded.id).select('-password');

      if (!req.user) {
        logger.warn(`Auth failed: User not found for token.`);
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      next(); // Move to the next middleware or route handler
    } catch (error) {
      logger.error(`Auth failed: ${error.message}`);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    logger.warn('Auth failed: No token provided.');
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };