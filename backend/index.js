// --- FIX: Move this line to the very top ---
require('dotenv').config();
// --- END OF FIX ---

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const shopRoutes = require('./routes/shopRoutes');
// require('dotenv').config(); // <-- REMOVE THIS LINE FROM HERE
require('./schedulers/cronJobs');

const nodemailer = require('nodemailer');
const logger = require('./utils/logger'); // ✅ Import logger 

const app = express();
const PORT = process.env.PORT || 5002;

// ✅ Connect to MongoDB
if (connectDB) {
    connectDB();
    logger.info('✅ MongoDB connected successfully');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ✅ API Routes
app.use('/api', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/posts', require('./routes/postRoutes')); // ✅ Community Posts
app.use('/api/rewards', require('./routes/rewardRoutes')); // ✅ Reward Redemption
app.use('/api/community', require('./routes/communityRoutes')); // ✅ Community Features

// ✅ Contact form endpoint
app.post('/contact', async (req, res) => {
    const { fullName, emailAddress, message } = req.body;

    if (!fullName || !emailAddress || !message) {
        logger.error('❌ Contact form submission failed: missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // This transporter is fine because it's created *inside* the route handler,
        // long after dotenv.config() has run.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: `"${fullName}" <${emailAddress}>`,
            to: process.env.EMAIL_USER,
            subject: `🌱 New Contact from ${fullName}`,
            html: `<p><strong>Email:</strong> ${emailAddress}</p><p>${message}</p>`,
        });

        logger.info(`📩 Contact email received from ${emailAddress} by ${fullName}`);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        logger.error(`❌ Email sending failed from ${emailAddress}: ${err.message}`);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// ✅ Global Error Handler (must be AFTER all routes)
app.use((err, req, res, next) => {
    logger.error(`❌ Error: ${err.message}`);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// ✅ Server start
app.listen(PORT, () => {
    logger.info(`🌿 Growlify backend running on http://localhost:${PORT}`);
});