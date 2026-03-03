const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    productId: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        enum: ['budget', 'premium'],
        required: true
    },
    frontViewImage: {
        type: String,
        required: true
    },
    topViewImage: {
        type: String,
        required: true
    },
    videoPath: {
        type: String,
        required: false
    },
    heightCm: {
        type: Number,
        required: true
    },
    widthCm: {
        type: Number,
        required: true
    },
    estimatedAmount: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    quotationPdfPath: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quotation', quotationSchema);
