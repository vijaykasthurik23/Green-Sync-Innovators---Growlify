const jwt = require('jsonwebtoken');
const logger = require('./logger');
const Signup = require('../models/Signup'); // Import the user model

// A simple middleware to verify the JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // You must use the same JWT_SECRET you used to sign the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    // The token contains { id: user._id }
    const user = await Signup.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add the user to the request object
    req.user = user;
    next();

  } catch (err) {
    logger.error("Token verification failed:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;