const mongoose = require('mongoose');
const logger = require('../utils/logger'); // ✅ import logger

const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growlify';
        await mongoose.connect(connStr);
        logger.info('MongoDB connected successfully'); // ✅ log success
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`); // ✅ log error
        process.exit(1);
    }
};

module.exports = connectDB;
