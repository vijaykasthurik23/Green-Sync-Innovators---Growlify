const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env
const logger = require('../utils/logger');
const {
    diagnosisTemplate,
    reengagementTemplate,
    smartReminderTemplate,
    organicTipTemplate,
    otpTemplate,
    rewardRedeemedTemplate,
    registerTemplate,
    systemAlertTemplate,
    setImageBase
} = require('../utils/emailTemplates');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Fix for self-signed certificate in certificate chain
    }
});

logger.info(`📧 Email transporter initialized with user: ${process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '...' : 'MISSING'}`);

const sendEmail = async ({ to, subject, text, html, attachments }) => {
    if (!to || typeof to !== 'string') {
        logger.error('❌ Cannot send email — recipient address is missing or invalid:', to);
        return;
    }

    const mailOptions = {
        from: `"Growlify" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
        attachments // ✅ Added support for CID attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`✅ Email sent successfully to ${to}`);
    } catch (err) {
        logger.error(`❌ Failed to send email to ${to}:`, err);
    }
};

// 🩺 Send Diagnosis Report
const sendDiagnosisEmail = async (to, name, plantName, diseaseName, confidence, cure, cause) => {
    setImageBase('cid:');
    const isHealthy = diseaseName && diseaseName.toLowerCase().includes('healthy');
    const imgName = isHealthy ? 'healthy_plant.png' : 'sick_plant.png';
    const subject = `🩺 Diagnosis Report: ${plantName} needs help!`;
    const html = diagnosisTemplate(name, plantName, diseaseName, confidence, cure, cause);
    const text = `Your ${plantName} has been diagnosed with ${diseaseName}. Check your email for care tips.`;
    const attachments = [{
        filename: imgName,
        path: path.join(__dirname, `../../email_assets/${imgName}`),
        cid: imgName
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 🥺 Send Re-engagement Email
const sendReengagementEmail = async (to, name, daysInactive) => {
    setImageBase('cid:');
    const subject = `🥺 Your plants miss you, ${name}!`;
    const html = reengagementTemplate(name, daysInactive);
    const text = `It's been ${daysInactive} days. Come back to your garden!`;
    const attachments = [{
        filename: 'dormant_seed.png',
        path: path.join(__dirname, '../../email_assets/dormant_seed.png'),
        cid: 'dormant_seed.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 💧 Send Smart Reminder
const sendSmartReminderEmail = async (to, plantType, tips) => {
    setImageBase('cid:');
    const subject = `💧 Time to water your ${plantType} plants!`;
    const html = smartReminderTemplate(plantType, tips);
    const text = `Time to water your ${plantType} plants!`;
    const attachments = [{
        filename: 'reminder_plant.png',
        path: path.join(__dirname, '../../email_assets/reminder_plant.png'),
        cid: 'reminder_plant.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 🍃 Send Organic Tip Email
const sendOrganicTipsEmail = async (to, name, plantName, day, tip, itemName) => {
    setImageBase('cid:');
    const subject = `💡 Day ${day} Care Tip for your ${plantName}`;
    const html = organicTipTemplate(name, plantName, day, tip, itemName);
    const text = `Tip for ${plantName}: ${tip}`;
    const attachments = [{
        filename: 'daily_tip.png',
        path: path.join(__dirname, '../../email_assets/daily_tip.png'),
        cid: 'daily_tip.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 📨 Send Registration Welcome
const sendRegistrationEmail = async (to, name) => {
    setImageBase('cid:');
    const subject = `🌿 Welcome to Growlify, ${name}!`;
    const html = registerTemplate(name);
    const text = `Welcome to Growlify, ${name}! A new plot is waiting for you.`;
    const attachments = [{
        filename: 'dormant_seed.png',
        path: path.join(__dirname, '../../email_assets/dormant_seed.png'),
        cid: 'dormant_seed.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 🎫 Send Reward Redemption Confirmation
const sendRewardEmail = async (to, name, rewardName, pointsSpent, remainingPoints) => {
    setImageBase('cid:');
    const subject = `📒 Reward Redeemed: Enjoy your ${rewardName}!`;
    const html = rewardRedeemedTemplate(name, rewardName, pointsSpent, remainingPoints);
    const text = `You've successfully redeemed ${rewardName}. Great job!`;
    const attachments = [{
        filename: 'daily_tip.png', // Using magic tip image for reward
        path: path.join(__dirname, '../../email_assets/daily_tip.png'),
        cid: 'daily_tip.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// 🔐 Send OTP Access Code
const sendOTPEmail = async (to, name, code, purpose) => {
    setImageBase('cid:');
    const subject = `🔐 Your Growlify Access Code`;
    const html = otpTemplate(name, code, purpose);
    const text = `Your Growlify access code is: ${code}. Use it to complete your ${purpose}.`;
    const attachments = [{
        filename: 'otp_hummingbird.png',
        path: path.join(__dirname, '../../email_assets/otp_hummingbird.png'),
        cid: 'otp_hummingbird.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

// ⚠️ Send System Alert
const sendSystemAlertEmail = async (to, message) => {
    setImageBase('cid:');
    const subject = `⚠️ Growlify System Alert`;
    const html = systemAlertTemplate(message);
    const text = `A system alert was triggered: ${message}`;
    const attachments = [{
        filename: 'sick_plant.png', // Using sick plant image for alert
        path: path.join(__dirname, '../../email_assets/sick_plant.png'),
        cid: 'sick_plant.png'
    }];
    await sendEmail({ to, subject, text, html, attachments });
};

module.exports = {
    sendEmail,
    sendDiagnosisEmail,
    sendReengagementEmail,
    sendSmartReminderEmail,
    sendOrganicTipsEmail,
    sendRegistrationEmail,
    sendRewardEmail,
    sendOTPEmail,
    sendSystemAlertEmail
};
