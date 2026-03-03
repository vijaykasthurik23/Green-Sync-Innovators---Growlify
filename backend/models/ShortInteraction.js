const mongoose = require('mongoose');

const shortInteractionSchema = new mongoose.Schema({
    shortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Short',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['view', 'like'],
        required: true
    }
}, {
    timestamps: true
});

// Index for user's interaction history
shortInteractionSchema.index({ userId: 1, type: 1, createdAt: -1 });

// Unique index for likes to prevent duplicates
shortInteractionSchema.index(
    { shortId: 1, userId: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: { type: 'like' }
    }
);

module.exports = mongoose.model('ShortInteraction', shortInteractionSchema);
