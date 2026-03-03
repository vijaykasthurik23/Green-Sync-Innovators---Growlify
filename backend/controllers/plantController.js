const Plant = require('../models/Plant');
const Signup = require('../models/Signup'); // Keep this, it's used by the auth logic
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken'); // 👈 ADDED: To verify tokens
require('dotenv').config(); // 👈 ADDED: To access JWT_SECRET

// 🌟 FIX: Helper function to verify JWT and get user ID
// This replaces the manual token check in each function.
// In a larger app, this would be middleware.
const getUserIdFromToken = (req) => {
  let token;
  // Check for the standard Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer 12345...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Return the user ID (which is stored in the 'id' field of the token)
      return decoded.id;
    } catch (error) {
      logger.warn(`[AUTH] Invalid token: ${error.message}`);
      return null;
    }
  }

  if (!token) {
    logger.warn('[AUTH] Missing token');
    return null;
  }
};


exports.addPlant = async (req, res) => {
  // 🌟 FIX: Get user ID from the verified JWT
  const userId = getUserIdFromToken(req);

  if (!userId) {
    logger.warn('[AUTH] Missing or invalid token in addPlant');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 🌟 FIX: Check if the user exists (good practice)
    const user = await Signup.findById(userId);
    if (!user) {
      logger.warn(`[AUTH] User not found for ID: ${userId}`);
      return res.status(401).json({ message: 'Invalid user' });
    }

    // 🌟 FIX: Save the plant with the correct userId
    const newPlant = await Plant.create({ ...req.body, userId: userId });
    logger.info(`[ADD PLANT] New plant added for user ${userId}: ${newPlant._id}`);
    res.json(newPlant);
  } catch (err) {
    logger.error(`[ADD PLANT ERROR] ${err.message}`);
    res.status(500).json({ message: 'Failed to add plant' });
  }
};

exports.getPlants = async (req, res) => {
  // 🌟 FIX: Get user ID from the verified JWT
  const userId = getUserIdFromToken(req);
  if (!userId) {
    logger.warn('[AUTH] Missing token in getPlants');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 🌟 FIX: Find plants using the correct userId
    const plants = await Plant.find({ userId: userId });
    logger.info(`[GET PLANTS] Retrieved ${plants.length} plants for user ${userId}`);
    res.json(plants);
  } catch (err) {
    logger.error(`[GET PLANTS ERROR] ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch plants' });
  }
};

exports.deletePlant = async (req, res) => {
  // 🌟 FIX: Get user ID from the verified JWT
  const userId = getUserIdFromToken(req);
  if (!userId) {
    logger.warn('[AUTH] Missing token in deletePlant');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 🌟 FIX: Ensure the plant belongs to the user before deleting
    const plant = await Plant.findOne({ _id: req.params.id, userId: userId });

    if (!plant) {
      logger.warn(`[DELETE PLANT] Plant not found or user mismatch. Plant: ${req.params.id}, User: ${userId}`);
      return res.status(404).json({ message: 'Plant not found or you do not have permission to delete it.' });
    }

    await Plant.deleteOne({ _id: req.params.id, userId: userId });
    logger.info(`[DELETE PLANT] Plant ${req.params.id} deleted for user ${userId}`);
    res.json({ message: 'Plant deleted' });
  } catch (err) {
    logger.error(`[DELETE PLANT ERROR] ${err.message}`);
    res.status(500).json({ message: 'Failed to delete plant' });
  }
};

//  Send Diagnosis Email Report
exports.sendDiagnosisReport = async (req, res) => {
  // Get user ID from token
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in to receive the report.' });
  }

  const { plantName, diseaseName, confidence, cure, cause } = req.body;

  try {
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { sendDiagnosisEmail } = require('../services/emailService');
    await sendDiagnosisEmail(
      user.email,
      user.name,
      plantName || 'Plant',
      diseaseName,
      confidence,
      cure || 'Check app for details',
      cause || 'Unknown'
    );

    logger.info('[DIAGNOSIS EMAIL] Sent to ' + user.email);
    res.json({ message: 'Diagnosis report sent to your email! ' });
  } catch (err) {
    logger.error('[DIAGNOSIS EMAIL ERROR] ' + err.message);
    res.status(500).json({ message: 'Failed to send diagnosis email' });
  }
};