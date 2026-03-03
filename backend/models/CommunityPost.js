const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true
    },
    images: [{
        type: String // URLs to uploaded images
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
communityPostSchema.index({ userId: 1, createdAt: -1 });
communityPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
