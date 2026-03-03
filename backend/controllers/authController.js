// controllers/authController.js

const Signup = require('../models/Signup');
const Login = require('../models/Login');
const { sendEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken'); // 👈 ADDED: For creating tokens
require('dotenv').config(); // 👈 ADDED: To access JWT_SECRET

// --- Helper: Generate JWT ---
const generateToken = (id) => {
  // We sign the user's MongoDB _id into the token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will last for 30 days
  });
};

let otpStore = {};

// ✅ Password strength validator
const isStrongPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// 💌 --- Growlify Email Templates (HTML + emojis + logo)
const BRAND = 'Growlify';
const LOGO_URL = 'https://yourserver.com/images/logo1.png'; // 👈 change this to your actual hosted logo path
const SUPPORT_EMAIL = 'support@growlify.example';
const accent = '#16a34a';
const grey = '#6b7280';

const buildOTPEmail = ({ name = 'Friend', code, minutes = 5, purpose = 'verify' }) => {
  const isVerify = purpose === 'verify';
  const subject = isVerify
    ? `🌿 Welcome to ${BRAND}! Here’s your OTP 💚`
    : `🔐 ${BRAND} Password Reset Code`;

  const preheader = isVerify
    ? `Your ${BRAND} verification code is ${code} — valid for ${minutes} minutes.`
    : `Reset your ${BRAND} password with this code — valid for ${minutes} minutes.`;

  const friendlyPurpose = isVerify ? 'Verify your email' : 'Reset your password';

  const motivationalLine = isVerify
    ? "✨ Every little seed of care grows into something beautiful. Let’s start your journey with Growlify! 🌱"
    : "💫 Don’t worry, every wilted leaf gets another chance to grow again. Let’s reset your password and keep blooming! 🌼";

  const text = `${friendlyPurpose} — ${BRAND}

Hi ${name},

Your one-time code is: ${code}
It expires in ${minutes} minutes.

${motivationalLine}

Security tips:
• Never share this code with anyone.
• ${BRAND} will never ask for this code via chat or phone.

If you didn’t request this, please ignore this email.

Leaf-fully yours,
Team ${BRAND} 🌿`;

  const html = `
<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${subject}</title>
    <style>
      @media (max-width: 480px) {
        .container { padding: 16px !important; }
        .card { padding: 20px !important; }
        .otp { font-size: 28px !important; letter-spacing: 6px !important; }
      }
      .logo { font-weight: 800; font-size: 20px; }
      .muted { color: ${grey}; }
      .otp {
        font-family: monospace;
        font-size: 32px; letter-spacing: 8px;
        padding: 12px 16px; border-radius: 12px;
        background: #f0fdf4; border: 1px dashed ${accent};
        display: inline-block;
      }
      .card {
        background: #fff; border: 1px solid #e5e7eb;
        border-radius: 16px; padding: 28px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      }
      .footer { font-size: 12px; color: ${grey}; }
      .greeting { font-size: 18px; font-weight: 600; }
    </style>
  </head>
  <body style="margin:0;background:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
    <div class="container" style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="text-align:center;margin-bottom:18px;">
        <img src="${LOGO_URL}" alt="${BRAND} Logo" style="width:80px;height:auto;margin-bottom:6px;">
        <div class="logo">🌿 <strong>${BRAND}</strong></div>
        <div class="muted" style="font-size:0;opacity:0;height:0;overflow:hidden;">${preheader}</div>
      </div>

      <div class="card">
        <h1 style="margin:0 0 8px 0;">${isVerify ? 'Welcome to Growlify! 🌱' : 'Password Reset Request 🔒'}</h1>
        <p class="muted" style="margin-top:0">${friendlyPurpose} • Expires in <strong>${minutes} minutes</strong></p>

        <p class="greeting">Hi ${name},</p>
        <p>${motivationalLine}</p>

        <p style="margin:18px 0 22px 0;text-align:center;">
          <span class="otp">${code}</span>
        </p>

        <p style="color:${grey};font-size:14px;margin-top:0;">💡 Tip: You can copy & paste the code above.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0" />

        <p><strong>🔒 Security reminders:</strong></p>
        <ul style="margin:0 0 18px 18px;padding:0;">
          <li>Never share this code with anyone.</li>
          <li>${BRAND} will never ask for your OTP by phone or chat.</li>
        </ul>

        <p class="muted">If this wasn’t you, ignore this message or contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      </div>

      <p class="footer" style="text-align:center;margin-top:12px;">
        🌿 Leaf-fully yours,<br>Team ${BRAND} 💚<br><br>
        <small>© ${new Date().getFullYear()} ${BRAND} • Growing happiness, one plant at a time 🌸</small>
      </p>
    </div>
  </body>
</html>
  `.trim();

  return { subject, text, html };
};
// 💌 --- /Email helpers ---


// ✅ SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, city, otp } = req.body;

  const existingUser = await Signup.findOne({ email });
  if (existingUser) {
    logger.warn(`[SIGNUP] Attempt with existing email: ${email}`);
    return res.status(400).json({ message: 'You already have an account' });
  }

  const otpData = otpStore[email];
  if (!otpData || otpData.code !== otp || otpData.expiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must include 1 uppercase, 1 number, 1 special character, and be at least 8 characters long.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Signup.create({ name, email, password: hashedPassword, city });
    delete otpStore[email];
    logger.info(`[SIGNUP] New user registered: ${email}`);
    res.json({ message: 'Signup successful! Welcome to Growlify 🌿' });
  } catch (error) {
    logger.error(`[SIGNUP ERROR] ${error.message}`);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Signup.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    await Login.create({ email });
    logger.info(`[LOGIN] User logged in: ${email}`);

    // 🌟 FIX: Generate a real JWT token using the helper
    const token = generateToken(user._id);

    // Send the token AND the user object (for the profile page)
    res.json({ token, user }); // 👈 CHANGED

  } catch (error) {
    logger.error(`[LOGIN ERROR] ${error.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ SEND SIGNUP OTP (with welcoming tone)
exports.sendOTP = async (req, res) => {
  const { email, name } = req.body;
  const user = await Signup.findOne({ email });
  if (user) return res.status(400).json({ message: 'You already have an account' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;
  otpStore[email] = { code, expiry };

  const { subject, text, html } = buildOTPEmail({
    name: name || 'Friend',
    code,
    minutes: 5,
    purpose: 'verify'
  });

  try {
    await sendEmail({ to: email, subject, text, html });
    logger.info(`[OTP] Sent signup OTP to ${email}`);
    res.json({ message: '🌿 OTP sent successfully to your email!' });
  } catch (error) {
    logger.error(`[SEND OTP ERROR] ${error.message}`);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ SEND RESET OTP
exports.sendResetOTP = async (req, res) => {
  const { email, name } = req.body;
  const user = await Signup.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No account found with this email' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;
  otpStore[email] = { code, expiry };

  const { subject, text, html } = buildOTPEmail({
    name: name || user.name || 'Grower',
    code,
    minutes: 5,
    purpose: 'reset'
  });

  try {
    await sendEmail({ to: email, subject, text, html });
    logger.info(`[RESET OTP] Sent password reset OTP to ${email}`);
    res.json({ message: '🔐 Password reset OTP sent to your email!' });
  } catch (error) {
    logger.error(`[SEND RESET OTP ERROR] ${error.message}`);
    res.status(500).json({ message: 'Failed to send reset OTP' });
  }
};

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  const otpData = otpStore[email];
  if (!otpData || otpData.code !== otp || otpData.expiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      message: 'Password must include 1 uppercase, 1 number, 1 special character, and be at least 8 characters long.'
    });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await Signup.updateOne({ email }, { password: hashed });
    delete otpStore[email];
    logger.info(`[RESET PASSWORD] Password reset successful for ${email}`);
    res.json({ message: '✅ Password reset successful! You can now log in again.' });
  } catch (error) {
    logger.error(`[RESET PASSWORD ERROR] ${error.message}`);
    res.status(500).json({ message: 'Password reset failed' });
  }
};