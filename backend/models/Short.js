const mongoose = require('mongoose');

const shortSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    likesCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
shortSchema.index({ userId: 1, createdAt: -1 });
shortSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Short', shortSchema);
