const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityPost',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate saves
saveSchema.index({ postId: 1, userId: 1 }, { unique: true });
saveSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Save', saveSchema);
