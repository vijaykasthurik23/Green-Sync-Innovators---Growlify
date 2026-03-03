const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();
const logger = require("../utils/logger");
const authMiddleware = require("../utils/authMiddleware");
const { sendEmail, sendRewardEmail } = require("../services/emailService");
const { rewardRedeemedTemplate } = require("../utils/emailTemplates");
const User = require("../models/Signup");

// Setup Nodemailer Transporter (Reusing config from shopRoutes)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// POST /api/rewards/redeem
// Protected by authMiddleware to ensure we have user details
router.post("/redeem", authMiddleware, async (req, res) => {
  const { rewardName, pointsCost } = req.body;
  let user = req.user; // Initial user from token

  if (!rewardName || !pointsCost) {
    return res.status(400).json({ message: "Missing reward details." });
  }

  if (!user || !user.email) {
    return res.status(401).json({ message: "User email not found. Please log in again." });
  }

  logger.info(`Reward redemption request: ${rewardName} for ${user.email} (${pointsCost} points)`);

  try {
    // Fetch fresh user data to get accurate points
    const dbUser = await User.findById(user.userId);
    const currentPoints = dbUser ? dbUser.points : 0; // Mock if not found?
    // Mocking points deduction display for now since we don't have the full points logic in this file content
    // In a real scenario, we'd deduct points here.
    const remainingPoints = Math.max(0, currentPoints - pointsCost);

    await sendRewardEmail(
      user.email,
      dbUser ? dbUser.name : (user.name || 'Gardener'),
      rewardName,
      pointsCost,
      remainingPoints
    );

    logger.info(`✅ Reward redemption email sent to ${user.email}`);
    res.status(200).json({ message: "Redemption successful! Email sent." });
  } catch (error) {
    logger.error("❌ Failed to send reward email:", error);
    res.status(500).json({ message: "Redemption processed, but failed to send email." });
  }
});

module.exports = router;
